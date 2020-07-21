#!/bin/bash

# Halt this script on non-zero returns codes
# and properly pipe failures
set -eo pipefail

echo -e "--- Setting Up Woodhouse Environment"
docker-compose -f .buildkite/docker-compose.yml run --rm woodhouse /bin/bash -c "npm ci --no-progress"

echo -e "--- Running Woodhouse Tests"
docker-compose -f .buildkite/docker-compose.yml run --rm woodhouse npm test
