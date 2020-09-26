#!/bin/bash

# Halt this script on non-zero returns codes
# and properly pipe failures
set -eo pipefail

echo -e "--- Setting Up Woodhouse Environment"
docker-compose -f .buildkite/docker-compose.yml run --rm woodhouse /bin/bash -c "rm -rf node_modules && npm ci --no-progress"

echo -e "--- Checking Prettier Ran"
docker-compose -f .buildkite/docker-compose-ci.yml run --rm woodhouse npx pretty-quick --check --pattern 'src/**/*.js*'

echo -e "--- Checking ESLint passes"
docker-compose -f .buildkite/docker-compose-ci.yml run --rm woodhouse npm run lint

echo -e "--- Running Woodhouse Tests"
docker-compose -f .buildkite/docker-compose.yml run --rm woodhouse npm test
