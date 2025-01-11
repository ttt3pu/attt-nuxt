#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if GITHUB_PAT is set
if [ -z "$GITHUB_PAT" ]; then
  echo "Error: GITHUB_PAT is not set."
  exit 1
fi

# Set submodule URL with authentication
SUBMODULE_NAME_PRISMA="packages/prisma"
SUBMODULE_URL_PRISMA="https://${GITHUB_PAT}@github.com/ttt3pu/attt-prisma.git"
SUBMODULE_NAME_RESUME="packages/resume"
SUBMODULE_URL_RESUME="https://${GITHUB_PAT}@github.com/ttt3pu/attt-resume.git"

echo "Updating submodule URL for ${SUBMODULE_NAME_PRISMA}..."
git submodule set-url "$SUBMODULE_NAME_PRISMA" "$SUBMODULE_URL_PRISMA"

echo "Updating submodule URL for ${SUBMODULE_NAME_RESUME}..."
git submodule set-url "$SUBMODULE_NAME_RESUME" "$SUBMODULE_URL_RESUME"

# Synchronize and update submodules
echo "Synchronizing submodules..."
git submodule sync

echo "Updating and initializing submodules..."
git submodule update --init

# Build the project
echo "Running build..."
pnpm i
pnpm install --ignore-scripts
pnpm prisma generate
pnpm prepare
pnpm run build

echo "Build completed successfully."
