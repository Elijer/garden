#!/bin/bash

# Get the current date and hour
current_date=$(date +"%Y-%m-%d")
current_hour=$(date +"%H")

# Create the commit message
commit_message="quick update on ${current_date}:${current_hour}"

YELLOW='\033[1;33m'
NC='\033[0m' # No Color

git status

# Prompt the user for confirmation with a yellow message
echo -e "${YELLOW}^^^ This is the current git status of the garden. Do you still want to commit and push both the content and the garden wrapper? (y/n): ${NC}"
stty -icanon # Turn off canonical mode (require immediate input)
confirm=$(head -c 1) # Read a single character
stty icanon # Turn canonical mode back on

if [[ $confirm == [yY] ]]; then
  # Run the git commit command with the generated message
  cd content
  git add .
  git commit -m "$commit_message"
  git push
  cd ..
  git add .
  npm run deploy
else
    echo "Commit and push canceled."
fi