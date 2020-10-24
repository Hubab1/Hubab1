#!/bin/bash

# Halt this script on non-zero returns codes
# and properly pipe failures
set -eo pipefail

echo -e "--- Setting Up Woodhouse Environment"
docker-compose -f .buildkite/docker-compose.yml run --rm woodhouse /bin/bash -c "rm -rf node_modules && npm ci --no-progress"

echo -e "--- Building Woodhouse"
docker-compose -f .buildkite/docker-compose.yml run --rm -e SENTRY_AUTH_TOKEN=${BUILDKITE_SENTRY_AUTH_TOKEN} woodhouse npm run release

echo -e "--- Deploying Woodhouse"
s3cmd --guess-mime-type --no-mime-magic sync build/ ${S3_BUCKET}
