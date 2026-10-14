#!/usr/bin/env bash
# For each variant worktree: (1) formatting check as CI does it, (2) module tests and package.
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
OUT=$HOME/src/spring-ai-4542-runs
for v in fix6932-on-2.0.1 fix6830-on-2.0.1 pr6932-head pr6830-head; do
  cd $HOME/src/spring-ai-wt/$v || continue
  echo "=== $v @ $(git rev-parse --short HEAD) format-check"
  ./mvnw -B -pl mcp/mcp-annotations -Dmaven.build.cache.enabled=false -P'!format-apply,format-check' -DskipTests validate > $OUT/$v.format-check.log 2>&1
  echo "format-check exit=$?"
  echo "=== $v module tests"
  ./mvnw -B -pl mcp/mcp-annotations -Dspring-javaformat.skip=true -Dmaven.build.cache.enabled=false package > $OUT/$v.module-tests.log 2>&1
  echo "module-tests exit=$?"
done
echo ALL-DONE
