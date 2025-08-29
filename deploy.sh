#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Streamlit Cloud Deployment Helper     ${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed.${NC}"
    echo -e "Please install git and try again."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo -e "${YELLOW}This directory is not a git repository.${NC}"
    echo -e "Would you like to initialize a git repository? (y/n)"
    read -r init_git
    
    if [[ $init_git == "y" || $init_git == "Y" ]]; then
        git init
        echo -e "${GREEN}Git repository initialized.${NC}"
    else
        echo -e "${RED}Cannot proceed without a git repository.${NC}"
        exit 1
    fi
fi

# Check if GitHub remote exists
if ! git remote -v | grep -q "github.com"; then
    echo -e "${YELLOW}No GitHub remote found.${NC}"
    echo -e "Please enter your GitHub username:"
    read -r github_username
    
    echo -e "Please enter a name for your repository:"
    read -r repo_name
    
    echo -e "${YELLOW}Creating GitHub remote...${NC}"
    git remote add origin "https://github.com/$github_username/$repo_name.git"
    echo -e "${GREEN}GitHub remote added.${NC}"
    
    echo -e "${YELLOW}Would you like to create this repository on GitHub now? (y/n)${NC}"
    echo -e "(Note: You'll need the GitHub CLI installed or you can create it manually on github.com)"
    read -r create_repo
    
    if [[ $create_repo == "y" || $create_repo == "Y" ]]; then
        if command -v gh &> /dev/null; then
            echo -e "${YELLOW}Creating repository on GitHub...${NC}"
            gh repo create "$repo_name" --public --source=. --remote=origin
            echo -e "${GREEN}Repository created on GitHub.${NC}"
        else
            echo -e "${YELLOW}GitHub CLI not found. Please create the repository manually at:${NC}"
            echo -e "https://github.com/new"
            echo -e "Repository name: ${BLUE}$repo_name${NC}"
            echo -e "Then push your code with: ${BLUE}git push -u origin main${NC}"
        fi
    fi
fi

# Check if files are staged for commit
if [[ -z $(git status --porcelain) ]]; then
    echo -e "${GREEN}No changes to commit.${NC}"
else
    echo -e "${YELLOW}Changes detected in the repository.${NC}"
    git status
    
    echo -e "${YELLOW}Would you like to commit these changes? (y/n)${NC}"
    read -r commit_changes
    
    if [[ $commit_changes == "y" || $commit_changes == "Y" ]]; then
        echo -e "${YELLOW}Enter a commit message:${NC}"
        read -r commit_message
        
        git add .
        git commit -m "$commit_message"
        echo -e "${GREEN}Changes committed.${NC}"
    fi
fi

# Push to GitHub
echo -e "${YELLOW}Would you like to push to GitHub now? (y/n)${NC}"
read -r push_to_github

if [[ $push_to_github == "y" || $push_to_github == "Y" ]]; then
    # Get the current branch
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    echo -e "${YELLOW}Pushing to GitHub...${NC}"
    git push -u origin "$current_branch"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Successfully pushed to GitHub.${NC}"
    else
        echo -e "${RED}Failed to push to GitHub.${NC}"
        exit 1
    fi
fi

# Open Streamlit Cloud
echo -e "${YELLOW}Would you like to open Streamlit Cloud to deploy your app? (y/n)${NC}"
read -r open_streamlit

if [[ $open_streamlit == "y" || $open_streamlit == "Y" ]]; then
    echo -e "${BLUE}Opening Streamlit Cloud in your browser...${NC}"
    
    # Try to open the URL using the appropriate command for the OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "https://share.streamlit.io/" &> /dev/null
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "https://share.streamlit.io/" &> /dev/null
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        start "https://share.streamlit.io/" &> /dev/null
    else
        echo -e "${YELLOW}Please open this URL in your browser:${NC}"
        echo -e "${BLUE}https://share.streamlit.io/${NC}"
    fi
    
    echo -e "${GREEN}Follow these steps on Streamlit Cloud:${NC}"
    echo -e "1. Sign in with your GitHub account"
    echo -e "2. Click 'New app'"
    echo -e "3. Select your repository"
    echo -e "4. Set the main file path to: ${BLUE}streamlit_app.py${NC}"
    echo -e "5. Click 'Deploy'"
    echo -e "6. Once deployed, add your OpenAI API key in the app settings"
fi

echo -e "${GREEN}Deployment preparation complete!${NC}"
echo -e "${BLUE}========================================${NC}"