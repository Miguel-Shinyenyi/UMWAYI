#!/usr/bin/env bash
# Usage: ./run-variant.sh <label> [path-to-mcp-annotations-jar] [client args...]
# Starts the repro server (unfixed release jar, or the given jar in its place), runs the client, stops the server.
# Needs JAVA_HOME pointing at a JDK 17 and a prior "mvn package" plus "mvn dependency:build-classpath -Dmdep.outputFile=cp.txt".
set -u
cd "$(dirname "$0")"
LABEL=$1; JAR=${2:-}; shift 2 || shift $#
PORT=${PORT:-8089}
CP=$(cat cp.txt)
if [ -n "$JAR" ]; then
  CP=$(echo "$CP" | tr ':' '\n' | sed -E "s#^.*/spring-ai-mcp-annotations-[^/]*\.jar\$#$JAR#" | paste -sd: -)
fi
mkdir -p out
echo "variant=$LABEL annotations-jar=$(echo "$CP" | tr ':' '\n' | grep mcp-annotations)" | tee "out/$LABEL.txt"
PORT=$PORT java -cp "target/classes:$CP" repro.Application > "out/$LABEL.server.log" 2>&1 &
SERVER=$!
for i in $(seq 1 60); do curl -s -o /dev/null "http://localhost:$PORT/mcp" && break; sleep 1; done
java -cp "target/classes:$CP" repro.Client "http://localhost:$PORT" "$@" 2>&1 | tee -a "out/$LABEL.txt"
kill $SERVER 2>/dev/null; wait $SERVER 2>/dev/null
