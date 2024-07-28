#!/bin/bash

# Get the current date and hour
current_date=$(date +"%Y-%m-%d")
current_hour=$(date +"%H")

# Create the commit message
commit_message="quick update on ${current_date}:${current_hour}"

# Run the git commit command with the generated message
cd content
git add .
git commit -m "$commit_message"
git push
cd ..
git add .
npm run deploy