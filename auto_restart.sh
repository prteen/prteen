#!/bin/zsh

function update_usage() {
  USAGE_OLD=$USAGE
  USAGE=$(du --exclude=.git --exclude=node_modules --exclude=tests --bytes --summarize | cut --fields=1)
}

while true; do
  update_usage
  if [[ $USAGE_OLD -ne $USAGE ]]; then
    if ! [[ -z $PID ]]; then
      echo "==> Restarting server..."
      kill -SIGINT $PID
      wait $PID
      echo "==> Old server existed."
    fi
    npm run dev &
    PID=$!
  fi
  sleep 1
done


