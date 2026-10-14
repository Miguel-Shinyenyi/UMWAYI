#!/usr/bin/env bash
# Runs the full 859 matrix. Needs mvn and java 17+ on PATH. Output: out/*.log and out/results.tsv
# Usage: ./run-matrix.sh [versions...]   (default: 2.0.0 2.0.1)
set -u
cd "$(dirname "$0")"
VERSIONS=("$@"); [ ${#VERSIONS[@]} -eq 0 ] && VERSIONS=(2.0.0 2.0.1)
OUT=out; mkdir -p "$OUT"; : > "$OUT/results.tsv"
CPDIR=$(mktemp -d)
for v in "${VERSIONS[@]}"; do
  mvn -q clean compile -Dsdk.version=$v || { echo "build failed for $v"; continue; }
  mvn -q dependency:build-classpath -Dsdk.version=$v -Dmdep.outputFile="$CPDIR/cp-$v.txt"
  for conn in nio nio2; do
    for scen in control slow saturate async-http sync-http; do
      mt=200; [ "$scen" = saturate ] && mt=2
      for run in 1 2 3; do
        log="$OUT/${v}_${conn}_${scen}_run${run}.log"
        java -Dsdk.version=$v -Dorg.slf4j.simpleLogger.defaultLogLevel=warn \
          -cp "target/classes:$(cat $CPDIR/cp-$v.txt)" repro.Repro859 \
          --connector $conn --scenario $scen --max-threads $mt --cap-seconds 60 > "$log" 2>&1
        r=$(grep '^RESULT' "$log" | head -1); [ -z "$r" ] && r="RESULT sdk=$v connector=$conn scenario=$scen outcome=NO-RESULT"
        printf "run%s\t%s\n" "$run" "$r" | tee -a "$OUT/results.tsv"
      done
    done
  done
done
rm -rf "$CPDIR"
