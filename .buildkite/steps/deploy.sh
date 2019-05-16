#!/bin/bash

# Halt this script on non-zero returns codes
# and properly pipe failures
set -eo pipefail

echo -e "--- Setting Up Woodhouse Environment"
docker-compose -f .buildkite/docker-compose.yml run --rm woodhouse /bin/bash -c "rm -rf node_modules && npm install --no-progress"

echo -e "--- Building Woodhouse"
docker-compose -f .buildkite/docker-compose.yml run --rm woodhouse npm run build

echo -e "--- Deploying Woodhouse"
s3cmd --guess-mime-type sync build/ s3://woodhouse-dev
