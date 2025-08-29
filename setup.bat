@echo off
echo ========================================
echo  LangChain Prompt Feedback Setup Script
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

echo Python is installed. Checking pip...

REM Check if pip is installed
python -m pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo pip is not installed or not working properly.
    echo Please install pip or fix your Python installation.
    pause
    exit /b 1
)

echo pip is installed. Installing required packages...

REM Install required packages
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install required packages.
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo Required packages installed successfully!
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file for API keys...
    echo # OpenAI API Key> .env
    echo OPENAI_API_KEY=> .env
    echo.
    echo # Add other environment variables below>> .env
    echo.
    echo Created .env file. Please edit it to add your API keys.
)

echo.
echo Setup completed successfully!
echo.
echo You can now run the app with: streamlit run streamlit_app.py
echo.

REM Ask if user wants to run the app
set /p run_app=Do you want to run the app now? (y/n): 

if /i "%run_app%"=="y" (
    echo.
    echo Starting Streamlit app...
    echo.
    streamlit run streamlit_app.py
) else (
    echo.
    echo You can run the app later with: streamlit run streamlit_app.py
    echo.
)

pause