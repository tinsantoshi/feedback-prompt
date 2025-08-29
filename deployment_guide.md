# Streamlit Cloud Deployment Guide for LangChain Prompt Feedback Component

This guide will walk you through deploying the LangChain Prompt Feedback Component to Streamlit Cloud. This is designed for beginners with no prior experience in deployment.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setting Up Your Local Environment](#setting-up-your-local-environment)
3. [Creating a Streamlit App](#creating-a-streamlit-app)
4. [Deploying to Streamlit Cloud](#deploying-to-streamlit-cloud)
5. [Customizing Your App](#customizing-your-app)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, make sure you have:

- A GitHub account (sign up at [github.com](https://github.com/signup) if you don't have one)
- A Streamlit Cloud account (sign up at [streamlit.io/cloud](https://streamlit.io/cloud) using your GitHub account)
- Git installed on your computer ([Download Git](https://git-scm.com/downloads))
- Python 3.7 or higher installed ([Download Python](https://www.python.org/downloads/))

## Setting Up Your Local Environment

### Step 1: Clone the Repository

1. Open your terminal or command prompt
2. Navigate to the directory where you want to store the project
3. Clone the repository by running:

```bash
git clone https://github.com/tinsantoshi/feedback-prompt.git
cd feedback-prompt
```

### Step 2: Create a Virtual Environment

Creating a virtual environment keeps your project dependencies isolated:

```bash
# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

Install the required packages:

```bash
pip install -r requirements.txt
```

If there's no requirements.txt file, create one with these contents:

```
streamlit>=1.22.0
langchain>=0.0.267
openai>=0.27.8
python-dotenv>=1.0.0
```

Save this as `requirements.txt` in the project root directory.

## Creating a Streamlit App

### Step 1: Create the Streamlit App File

Create a new file called `streamlit_app.py` in the project root directory:

```python
import streamlit as st
import os
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
import sys

# Add the project directory to the path so we can import our component
sys.path.append(".")

# Import our component
from src.PromptFeedbackChain import PromptFeedbackChain
from src.interfaces import FeedbackCriteria

# Set page configuration
st.set_page_config(
    page_title="LangChain Prompt Feedback Tool",
    page_icon="✨",
    layout="wide"
)

# App title and description
st.title("✨ LangChain Prompt Feedback Tool")
st.markdown("""
This tool helps you improve your prompts for LLMs by providing real-time feedback.
Type your prompt in the text area below and receive instant feedback on its quality.
""")

# Sidebar for configuration
st.sidebar.title("Configuration")

# API Key input
api_key = st.sidebar.text_input("OpenAI API Key", type="password", 
                               help="Enter your OpenAI API key. It will not be stored.")

# Feedback criteria selection
st.sidebar.subheader("Feedback Criteria")
clarity = st.sidebar.checkbox("Clarity", value=True, help="Is the prompt clear and specific?")
context = st.sidebar.checkbox("Context", value=True, help="Does it provide necessary context?")
constraints = st.sidebar.checkbox("Constraints", value=True, help="Does it specify constraints?")
examples = st.sidebar.checkbox("Examples", value=True, help="Does it include examples if needed?")
format = st.sidebar.checkbox("Format", value=True, help="Does it specify desired output format?")

# LLM selection
use_llm = st.sidebar.checkbox("Use LLM for advanced feedback", value=True, 
                             help="Uses an LLM to provide more detailed feedback (requires API key)")

# Create feedback criteria
criteria = {
    "clarity": clarity,
    "context": context,
    "constraints": constraints,
    "examples": examples,
    "format": format
}

# Main content
prompt_input = st.text_area("Enter your prompt:", height=150, 
                           placeholder="Type your prompt here. For example: Explain the concept of quantum computing to a high school student...")

# Process button
if st.button("Get Feedback"):
    if not prompt_input.strip():
        st.error("Please enter a prompt to receive feedback.")
    else:
        if use_llm and not api_key:
            st.error("Please enter your OpenAI API key to use LLM-based feedback.")
        else:
            with st.spinner("Analyzing your prompt..."):
                try:
                    # Set API key if provided
                    if api_key:
                        os.environ["OPENAI_API_KEY"] = api_key
                    
                    # Create the feedback chain
                    feedback_chain = PromptFeedbackChain({
                        "criteria": criteria,
                        "useLLM": use_llm and bool(api_key),
                        "debounceTime": 300,
                        "llmModel": "gpt-3.5-turbo" if api_key else None
                    })
                    
                    # Get feedback
                    result = feedback_chain.call({"input": prompt_input})
                    feedback = result.get("feedback", {})
                    
                    # Display feedback
                    st.subheader("Prompt Feedback")
                    
                    # Score with color coding
                    score = feedback.get("score", 0)
                    score_color = "red" if score < 50 else "orange" if score < 75 else "green"
                    st.markdown(f"### Score: <span style='color:{score_color}'>{score}/100</span>", unsafe_allow_html=True)
                    
                    # Strengths
                    if strengths := feedback.get("strengths", []):
                        st.markdown("### Strengths:")
                        for strength in strengths:
                            st.markdown(f"- ✅ {strength}")
                    
                    # Weaknesses
                    if weaknesses := feedback.get("weaknesses", []):
                        st.markdown("### Areas for Improvement:")
                        for weakness in weaknesses:
                            st.markdown(f"- 🔍 {weakness}")
                    
                    # Suggestions
                    if suggestions := feedback.get("suggestions", []):
                        st.markdown("### Suggestions:")
                        for suggestion in suggestions:
                            st.markdown(f"- 💡 {suggestion}")
                    
                    # Improved prompt
                    if improved_prompt := feedback.get("improvedPrompt"):
                        st.markdown("### Improved Prompt:")
                        st.text_area("", value=improved_prompt, height=150, disabled=True)
                        if st.button("Use This Improved Prompt"):
                            prompt_input = improved_prompt
                            st.experimental_rerun()
                
                except Exception as e:
                    st.error(f"An error occurred: {str(e)}")
                    st.error("If you're using LLM-based feedback, please check your API key.")

# Footer
st.markdown("---")
st.markdown("Built with ❤️ using LangChain and Streamlit")
```

### Step 2: Create a .streamlit Directory and Config File

Create a directory called `.streamlit` and a configuration file inside it:

```bash
mkdir -p .streamlit
```

Create a file called `config.toml` inside the `.streamlit` directory:

```toml
[theme]
primaryColor="#FF4B4B"
backgroundColor="#FFFFFF"
secondaryBackgroundColor="#F0F2F6"
textColor="#262730"
font="sans serif"
```

### Step 3: Create a requirements.txt File

If you haven't already created a requirements.txt file, create one with the following content:

```
streamlit>=1.22.0
langchain>=0.0.267
openai>=0.27.8
python-dotenv>=1.0.0
```

## Deploying to Streamlit Cloud

### Step 1: Push Your Changes to GitHub

First, you need to create your own GitHub repository and push your changes:

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "langchain-prompt-feedback-app")
4. Make it public
5. Click "Create repository"

Follow the instructions on GitHub to push your existing repository:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for Streamlit app"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your GitHub username and repository name.

### Step 2: Deploy on Streamlit Cloud

1. Go to [Streamlit Cloud](https://streamlit.io/cloud) and sign in with your GitHub account
2. Click "New app"
3. Select your repository, branch, and the main file path (`streamlit_app.py`)
4. Click "Deploy"

### Step 3: Configure Secrets (for API Keys)

1. Once your app is deployed, go to the app settings (⋮ menu in the top right of your app)
2. Click on "Secrets"
3. Add your OpenAI API key in the following format:

```yaml
openai:
  api_key: "your-api-key-here"
```

4. Click "Save"

Your app will automatically update with the new secrets.

## Customizing Your App

### Adding More Features

You can enhance your Streamlit app with additional features:

1. **History Tracking**: Add a feature to save and compare previous prompts
2. **Export Functionality**: Allow users to export their improved prompts
3. **Multiple LLM Support**: Add options for different LLM providers

Example code for adding history tracking:

```python
# Add this to your streamlit_app.py

# Initialize session state for history
if 'history' not in st.session_state:
    st.session_state.history = []

# After getting feedback, save to history
if feedback:
    history_item = {
        "original_prompt": prompt_input,
        "score": feedback.get("score", 0),
        "improved_prompt": feedback.get("improvedPrompt", "")
    }
    st.session_state.history.append(history_item)

# Display history in an expander
with st.expander("Prompt History"):
    if st.session_state.history:
        for i, item in enumerate(st.session_state.history):
            st.markdown(f"### Prompt {i+1}")
            st.markdown(f"**Original**: {item['original_prompt'][:50]}...")
            st.markdown(f"**Score**: {item['score']}/100")
            if st.button(f"View Details #{i}"):
                st.session_state.selected_history = i
                st.experimental_rerun()
    else:
        st.write("No history yet. Get feedback on prompts to build history.")
```

## Troubleshooting

### Common Issues and Solutions

1. **App Fails to Deploy**
   - Check that your `requirements.txt` file includes all necessary dependencies
   - Ensure your `streamlit_app.py` file is in the root directory
   - Verify that your GitHub repository is public

2. **API Key Issues**
   - Make sure you've added your API key to Streamlit Cloud secrets
   - Check that your code correctly accesses the secret

3. **Import Errors**
   - Ensure all required files are included in your repository
   - Check that import paths are correct

4. **App is Slow**
   - Consider using caching for expensive operations:
     ```python
     @st.cache_data
     def get_feedback(prompt, criteria, use_llm):
         # Your feedback logic here
         return result
     ```

### Getting Help

If you encounter issues not covered here:

1. Check the [Streamlit documentation](https://docs.streamlit.io/)
2. Visit the [Streamlit community forum](https://discuss.streamlit.io/)
3. Check the [LangChain documentation](https://python.langchain.com/docs/get_started/introduction)

## Next Steps

After successfully deploying your app:

1. **Share your app**: Share the URL with others
2. **Gather feedback**: Ask users for suggestions to improve the app
3. **Iterate**: Make improvements based on feedback
4. **Monitor usage**: Check Streamlit Cloud analytics to see how your app is being used

Congratulations! You've successfully deployed the LangChain Prompt Feedback Component to Streamlit Cloud.