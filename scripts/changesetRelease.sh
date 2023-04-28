#!/bin/bash

# Convert changesets into a new version
npx changeset version
# Update lock-file (needed to avoid invalid lock-file with outdated versions)
npm install --no-save --package-lock-only
