#!/usr/bin/env python3
"""
Test script for OpenAI API key validation.
This helps users verify their API key is working correctly.
"""

import os
import sys
import argparse
import time

def check_openai_installed():
    """Check if OpenAI package is installed"""
    try:
        import openai
        return True
    except ImportError:
        return False

def install_openai():
    """Install OpenAI package"""
    import subprocess
    print("OpenAI package not found. Installing...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "openai"])
        print("✅ OpenAI package installed successfully")
        return True
    except subprocess.SubprocessError:
        print("❌ Failed to install OpenAI package")
        return False

def test_api_key(api_key):
    """Test if the API key is valid"""
    import openai
    
    openai.api_key = api_key
    
    print("Testing API key...")
    try:
        # Make a simple API call to test the key
        start_time = time.time()
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello, are you working?"}
            ],
            max_tokens=10
        )
        end_time = time.time()
        
        # Check if the response is valid
        if response and response.choices and len(response.choices) > 0:
            print(f"✅ API key is valid! Response time: {end_time - start_time:.2f} seconds")
            print(f"Response: {response.choices[0].message.content}")
            return True
        else:
            print("❌ API key validation failed: Unexpected response format")
            return False
    except Exception as e:
        print(f"❌ API key validation failed: {str(e)}")
        return False

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Test OpenAI API key")
    parser.add_argument("--key", help="OpenAI API key to test")
    args = parser.parse_args()
    
    print("OpenAI API Key Tester")
    print("=====================")
    
    # Check if OpenAI is installed
    if not check_openai_installed():
        if not install_openai():
            print("Please install the OpenAI package manually: pip install openai")
            sys.exit(1)
    
    # Import OpenAI after ensuring it's installed
    import openai
    
    # Get API key from argument, environment variable, or user input
    api_key = args.key
    
    if not api_key:
        # Try to get from environment variable
        api_key = os.environ.get("OPENAI_API_KEY")
    
    if not api_key:
        # Ask user for API key
        api_key = input("Enter your OpenAI API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided")
        sys.exit(1)
    
    # Test the API key
    if test_api_key(api_key):
        print("\nYou can use this API key in the Streamlit app.")
        print("For Streamlit Cloud deployment, add this key to your app secrets.")
    else:
        print("\nPlease check your API key and try again.")
        print("If you're sure the key is correct, check your OpenAI account status.")

if __name__ == "__main__":
    main()