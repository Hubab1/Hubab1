#!/bin/bash

# Halt this script on non-zero returns codes
# and properly pipe failures
set -eo pipefail

export APP="woodhouse"
export DCR_CMD="docker-compose -f .buildkite/docker-compose.yml run --rm"

echo -e "--- Setting Up Woodhouse Environment"
$DCR_CMD woodhouse /bin/bash -c "rm -rf node_modules && npm ci --no-progress"

echo -e "--- Building Woodhouse"
# Secrets are stored and pulled from AWS Systems manager https://console.aws.amazon.com/systems-manager/parameters/?region=us-east-1&tab=Table
nestctl get-secrets "/${DEPLOY_ENVIRONMENT}/${APP}/config" -o env >> .env


if [ "${DEPLOY_ENVIRONMENT}" == 'staging' ] && [ ! -z "${STAGING_CHUCK_PR}" ]; then
    echo "updating  staging chuck url"
    echo "REACT_APP_CHUCK_DOMAIN=https://webhooks-chuck-pr${STAGING_CHUCK_PR}.nestiostaging.com" >> .env
fi

$DCR_CMD -e SENTRY_AUTH_TOKEN=${BUILDKITE_SENTRY_AUTH_TOKEN} woodhouse npm run release

echo -e "--- Deploying Woodhouse"
s3cmd --guess-mime-type --no-mime-magic sync build/ ${S3_BUCKET}
