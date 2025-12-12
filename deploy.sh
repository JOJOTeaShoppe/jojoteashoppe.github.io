#!/bin/bash

# Deployment script for Jojo Tea Shoppe website
# This script updates the version number and commits the changes

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment process...${NC}"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not a git repository${NC}"
    exit 1
fi

# Check if there are uncommitted changes (excluding version.js)
UNCOMMITTED=$(git status --porcelain | grep -v "version.js" | wc -l | tr -d ' ')
if [ "$UNCOMMITTED" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes:${NC}"
    git status --short | grep -v "version.js"
    echo ""
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Deployment cancelled.${NC}"
        exit 1
    fi
fi

# Get current timestamp in format YYYYMMDDHHMM
VERSION=$(date +"%Y%m%d%H%M")
OLD_VERSION=$(grep -oP "(?<=window.APP_VERSION = ')[^']+" version.js 2>/dev/null || echo "unknown")

echo -e "${GREEN}📝 Updating version: ${OLD_VERSION} → ${VERSION}${NC}"

# Update version.js
echo "window.APP_VERSION = '$VERSION';" > version.js

# Stage version.js
git add version.js

# Check if there are other changes to commit
OTHER_CHANGES=$(git status --porcelain | grep -v "^M  version.js" | wc -l | tr -d ' ')

if [ "$OTHER_CHANGES" -gt 0 ]; then
    echo -e "${YELLOW}📦 Staging all changes...${NC}"
    git add -A
    COMMIT_MSG="Deploy: Update version to $VERSION and other changes"
else
    COMMIT_MSG="Deploy: Update version to $VERSION"
fi

# Commit changes
echo -e "${GREEN}💾 Committing changes...${NC}"
if git commit -m "$COMMIT_MSG"; then
    echo -e "${GREEN}✅ Changes committed successfully${NC}"
else
    # Check if there's nothing to commit
    if [ $? -eq 1 ] && [ -z "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  Nothing to commit (version may already be up to date)${NC}"
    else
        echo -e "${RED}❌ Error: Failed to commit changes${NC}"
        exit 1
    fi
fi

# Ask if user wants to push
echo ""
read -p "Do you want to push to remote? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}📤 Pushing to remote...${NC}"
    
    # Get current branch name
    BRANCH=$(git branch --show-current)
    
    if git push origin "$BRANCH"; then
        echo -e "${GREEN}✅ Successfully pushed to remote${NC}"
        echo ""
        echo -e "${GREEN}🎉 Deployment complete!${NC}"
        echo -e "   Version: ${GREEN}${VERSION}${NC}"
        echo -e "   Branch: ${GREEN}${BRANCH}${NC}"
    else
        echo -e "${RED}❌ Error: Failed to push to remote${NC}"
        echo -e "${YELLOW}   You can push manually later with: git push${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⏸️  Skipping push. You can push manually later with: git push${NC}"
    echo ""
    echo -e "${GREEN}✅ Version updated and committed locally${NC}"
    echo -e "   Version: ${GREEN}${VERSION}${NC}"
fi

echo ""
echo -e "${GREEN}✨ Done!${NC}"

