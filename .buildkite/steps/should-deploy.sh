#!/bin/bash

# Halt this script on non-zero returns codes
# and properly pipe failures
set -eou pipefail

APP='woodhouse'

# Check to see if this PR should be deployed
main() {
    if [[ "${BUILDKITE_BRANCH}" == 'master' ]]; then
        echo "Adding production deploy steps."
        buildkite-agent pipeline upload .buildkite/deploy.yml

        # Alert the user who triggered this build that it's ready to deploy
        # nestctl broadcast-deploy-ready
        exit
    fi

    if [[ "${BUILDKITE_BRANCH}" == 'demo' ]]; then
        echo "Adding demo deploy steps."
        buildkite-agent pipeline upload .buildkite/deploy-demo.yml
        exit
    fi

    export PR_ABBR=$(nestctl buildkite-env)

    if aws s3 cp "s3://nestio-infrastructure/staging-envs/staged/${APP}/${PR_ABBR}" - > /dev/null; then
        echo "${PR_ABBR} is staged, adding deploy steps."
        buildkite-agent pipeline upload .buildkite/deploy-staging.yml
    else
        echo "${BUILDKITE_BRANCH} is not staged, not deploying."
    fi
}

main
