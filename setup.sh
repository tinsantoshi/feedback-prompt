#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  LangChain Prompt Feedback Setup Script ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python is not installed.${NC}"
    echo "Please install Python 3.7 or higher."
    exit 1
fi

echo -e "${GREEN}Python is installed.${NC} Checking pip..."

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo -e "${RED}pip is not installed or not working properly.${NC}"
    echo "Please install pip or fix your Python installation."
    exit 1
fi

echo -e "${GREEN}pip is installed.${NC} Installing required packages..."

# Install required packages
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install required packages.${NC}"
    echo "Please check your internet connection and try again."
    exit 1
fi

echo
echo -e "${GREEN}Required packages installed successfully!${NC}"
echo

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file for API keys...${NC}"
    echo "# OpenAI API Key" > .env
    echo "OPENAI_API_KEY=" >> .env
    echo >> .env
    echo "# Add other environment variables below" >> .env
    echo
    echo -e "${GREEN}Created .env file. Please edit it to add your API keys.${NC}"
fi

echo
echo -e "${GREEN}Setup completed successfully!${NC}"
echo
echo -e "You can now run the app with: ${BLUE}streamlit run streamlit_app.py${NC}"
echo

# Ask if user wants to run the app
read -p "Do you want to run the app now? (y/n): " run_app

if [[ $run_app == "y" || $run_app == "Y" ]]; then
    echo
    echo -e "${YELLOW}Starting Streamlit app...${NC}"
    echo
    streamlit run streamlit_app.py
else
    echo
    echo -e "You can run the app later with: ${BLUE}streamlit run streamlit_app.py${NC}"
    echo
fi