#!/usr/bin/env bash
# Runs every 882 row, 3 times per SDK version, versions in parallel.
# Needs mvn and java 17+ on PATH. Output: out/<version>_run<n>.log (stdout) and out/results.tsv
# Takes about 12 minutes: rows that hang wait for the client's 20 second timeout.
# Usage: ./run-matrix.sh [versions...]   (default: 1.1.0 1.1.4 2.0.1)
set -u
cd "$(dirname "$0")"
VERSIONS=("$@"); [ ${#VERSIONS[@]} -eq 0 ] && VERSIONS=(1.1.0 1.1.4 2.0.1)
OUT=out; mkdir -p "$OUT"
WORK=$(mktemp -d)
for v in "${VERSIONS[@]}"; do
  mvn -q clean compile -Dsdk.version=$v || { echo "build failed for $v"; continue; }
  mkdir -p "$WORK/classes-$v"; cp -R target/classes/. "$WORK/classes-$v/"
  mvn -q dependency:build-classpath -Dsdk.version=$v -Dmdep.outputFile="$WORK/cp-$v.txt"
done
for v in "${VERSIONS[@]}"; do
  ( for run in 1 2 3; do
      java -Dsdk.version=$v -Dorg.slf4j.simpleLogger.defaultLogLevel=warn \
        -cp "$WORK/classes-$v:$(cat $WORK/cp-$v.txt)" repro.Repro882 > "$OUT/${v}_run${run}.log" 2> "$WORK/${v}_run${run}.err.log"
    done ) &
done
wait
: > "$OUT/results.tsv"
for v in "${VERSIONS[@]}"; do for run in 1 2 3; do
  grep '^ROW' "$OUT/${v}_run${run}.log" | sed "s/^/run${run}\t/" >> "$OUT/results.tsv"
done; done
echo "rows: $(wc -l < "$OUT/results.tsv")"
rm -rf "$WORK"
