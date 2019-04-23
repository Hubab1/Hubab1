#!/bin/bash

# Halt this script on non-zero returns codes
# and properly pipe failures
set -eou pipefail

# Check to see if this PR should be deployed
main() {
    if [[ "${BUILDKITE_BRANCH}" == 'master' ]]; then
        echo "Adding production deploy steps."
        buildkite-agent pipeline upload .buildkite/deploy.yml

        # Alert the user who triggered this build that it's ready to deploy
        # nestctl broadcast-deploy-ready
        exit
    fi
}

main
