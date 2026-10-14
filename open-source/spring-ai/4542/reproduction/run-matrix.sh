#!/usr/bin/env bash
# Runs every tool against: the unfixed 2.0.1 release, and 2.0.1 with each fix's jar swapped in. Two rounds.
# Needs: JDK 17 in JAVA_HOME, the repro built, and the fix jars built (see ../spring-ai-4542-runs/build-variants.sh).
set -u
cd "$(dirname "$0")"
WT=${WT:-$HOME/src/spring-ai-wt}
jar_for() {
  case "$1" in
    baseline) echo "" ;;
    pr6932) echo "$WT/fix6932-on-2.0.1/mcp/mcp-annotations/target/spring-ai-mcp-annotations-2.0.1.jar" ;;
    pr6830) echo "$WT/fix6830-on-2.0.1/mcp/mcp-annotations/target/spring-ai-mcp-annotations-2.0.1.jar" ;;
  esac
}
TOOLS="flux-0 flux-1 flux-3 flux-error-after-2 flux-nulls flux-slow flux-large flux-calltoolresult mono-string mono-list list-plain flux-structured mono-structured"
for round in 1 2; do
  for v in baseline pr6932 pr6830; do
    ./run-variant.sh "matrix-$v-round$round" "$(jar_for $v)" $TOOLS > /dev/null 2>&1
    echo "matrix-$v-round$round calls: $(grep -c '^CALL' "out/matrix-$v-round$round.txt")"
  done
done
