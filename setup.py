#!/usr/bin/env python3
"""
Setup script for the LangChain Prompt Feedback Streamlit app.
This script helps users set up their environment for running the app.
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.7 or higher"""
    if sys.version_info < (3, 7):
        print("Error: Python 3.7 or higher is required.")
        sys.exit(1)
    print(f"✅ Python version: {sys.version.split()[0]}")

def check_pip():
    """Check if pip is installed"""
    try:
        subprocess.run([sys.executable, "-m", "pip", "--version"], 
                      check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("✅ pip is installed")
        return True
    except (subprocess.SubprocessError, FileNotFoundError):
        print("❌ pip is not installed or not working properly")
        return False

def install_requirements():
    """Install required packages"""
    requirements_file = Path("requirements.txt")
    
    if not requirements_file.exists():
        print("❌ requirements.txt not found")
        return False
    
    print("📦 Installing required packages...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", str(requirements_file)], 
                      check=True)
        print("✅ Required packages installed successfully")
        return True
    except subprocess.SubprocessError as e:
        print(f"❌ Failed to install required packages: {e}")
        return False

def check_streamlit():
    """Check if Streamlit is installed and working"""
    try:
        result = subprocess.run([sys.executable, "-m", "streamlit", "--version"], 
                               check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        version = result.stdout.decode().strip() or result.stderr.decode().strip()
        print(f"✅ Streamlit is installed: {version}")
        return True
    except (subprocess.SubprocessError, FileNotFoundError):
        print("❌ Streamlit is not installed or not working properly")
        return False

def setup_env_file():
    """Create a .env file for environment variables"""
    env_file = Path(".env")
    
    if env_file.exists():
        print("ℹ️ .env file already exists")
        return
    
    print("🔑 Creating .env file for API keys...")
    with open(env_file, "w") as f:
        f.write("# OpenAI API Key\n")
        f.write("OPENAI_API_KEY=\n\n")
        f.write("# Add other environment variables below\n")
    
    print("✅ Created .env file. Please edit it to add your API keys.")

def run_app():
    """Run the Streamlit app"""
    app_file = Path("streamlit_app.py")
    
    if not app_file.exists():
        print("❌ streamlit_app.py not found")
        return False
    
    print("🚀 Running the Streamlit app...")
    try:
        subprocess.run([sys.executable, "-m", "streamlit", "run", str(app_file)], check=True)
        return True
    except subprocess.SubprocessError as e:
        print(f"❌ Failed to run the Streamlit app: {e}")
        return False
    except KeyboardInterrupt:
        print("\n👋 App stopped by user")
        return True

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Setup script for LangChain Prompt Feedback Streamlit app")
    parser.add_argument("--install-only", action="store_true", help="Only install requirements without running the app")
    parser.add_argument("--run-only", action="store_true", help="Only run the app without installing requirements")
    args = parser.parse_args()
    
    print("🔧 Setting up LangChain Prompt Feedback Streamlit app...")
    
    # Check Python version
    check_python_version()
    
    if not args.run_only:
        # Check pip
        if not check_pip():
            print("Please install pip and try again.")
            sys.exit(1)
        
        # Install requirements
        if not install_requirements():
            print("Failed to install required packages. Please install them manually.")
            sys.exit(1)
        
        # Setup .env file
        setup_env_file()
    
    if not args.install_only:
        # Check Streamlit
        if not check_streamlit():
            print("Streamlit is not installed or not working properly.")
            print("Please make sure Streamlit is installed correctly.")
            sys.exit(1)
        
        # Run the app
        run_app()
    
    if args.install_only:
        print("\n✅ Setup completed successfully! Run the app with: streamlit run streamlit_app.py")

if __name__ == "__main__":
    main()