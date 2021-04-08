#!/bin/bash

# Halt this script on non-zero returns codes
# and properly pipe failures
set -eo pipefail

export APP="woodhouse"
export DCR_CMD="docker-compose -f .buildkite/docker-compose.yml run --rm"

echo -e "--- Setting Up Woodhouse Environment"
$DCR_CMD woodhouse /bin/bash -c "rm -rf node_modules && npm ci --no-progress"

echo -e "--- Building Woodhouse"
nestctl get-secrets "/${DEPLOY_ENVIRONMENT}/${APP}/config" -o env >> .env
$DCR_CMD -e SENTRY_AUTH_TOKEN=${BUILDKITE_SENTRY_AUTH_TOKEN} DEPLOY_ENVIRONMENT=${DEPLOY_ENVIRONMENT} woodhouse npm run release

echo -e "--- Deploying Woodhouse"
s3cmd --guess-mime-type --no-mime-magic sync build/ ${S3_BUCKET}
