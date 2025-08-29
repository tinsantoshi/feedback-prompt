# Troubleshooting Guide

This guide helps you solve common issues that may arise when deploying or running the LangChain Prompt Feedback Component on Streamlit Cloud.

## Common Errors and Solutions

### ModuleNotFoundError: No module named 'langchain_community'

**Error Message:**
```
ModuleNotFoundError: No module named 'langchain_community'
```

**Solution:**
This error occurs because newer versions of LangChain have reorganized their modules. The fix is to:

1. Use the updated `streamlit_app_fixed.py` file which handles both old and new LangChain versions
2. Make sure your `requirements.txt` includes both packages:
   ```
   langchain>=0.0.267
   langchain-community>=0.0.1
   ```

### API Key Issues

**Error Message:**
```
Error: OpenAI API key not found
```

**Solution:**
1. Check that you've added your API key in Streamlit Cloud secrets:
   - Go to your app settings
   - Click on "Secrets"
   - Add your key in this format:
     ```yaml
     openai:
       api_key: "your-api-key-here"
     ```
2. Alternatively, enter your API key directly in the sidebar of the app

### Import Error for PromptFeedbackChain

**Error Message:**
```
ImportError: Cannot import PromptFeedbackChain
```

**Solution:**
1. Make sure the repository structure is correct with all necessary files
2. Check that the `src` directory contains all the component files
3. Try using the adapter approach by importing from `adapter.py`

### Streamlit App Not Loading

**Issue:** The app shows a spinner but never loads completely

**Solution:**
1. Check the logs in Streamlit Cloud
2. Look for any error messages
3. Verify that all dependencies are correctly installed
4. Try restarting the app

### LLM-Based Feedback Not Working

**Issue:** The app works but LLM-based feedback doesn't generate results

**Solution:**
1. Check that your OpenAI API key is valid and has sufficient credits
2. Verify that you've selected "Use LLM for advanced feedback" in the sidebar
3. Try a different OpenAI model (e.g., switch from GPT-4 to GPT-3.5-turbo)
4. Check the logs for any specific error messages

## Deployment Issues

### GitHub Repository Not Found

**Issue:** Streamlit Cloud can't find your GitHub repository

**Solution:**
1. Make sure your repository is public
2. Verify that you've entered the correct repository name
3. Check that you've pushed all your changes to GitHub

### App Fails to Deploy

**Issue:** Streamlit Cloud shows an error when trying to deploy

**Solution:**
1. Check that your `requirements.txt` file is in the root directory
2. Verify that `streamlit_app.py` (or your main file) is in the root directory
3. Look at the deployment logs for specific error messages
4. Try deploying with a simpler version of the app first

## Performance Issues

### App Running Slowly

**Issue:** The app takes a long time to process prompts

**Solution:**
1. Use heuristic evaluation instead of LLM-based evaluation
2. Increase the debounce time in the sidebar
3. Try a faster OpenAI model
4. Simplify the prompt evaluation criteria

### High API Costs

**Issue:** Using the app is resulting in high OpenAI API costs

**Solution:**
1. Use heuristic evaluation for most prompts
2. Only use LLM-based evaluation for important prompts
3. Use GPT-3.5-turbo instead of GPT-4
4. Implement a usage limit in your app

## File Structure Issues

### CSS Not Loading

**Issue:** The custom styling is not applied to the app

**Solution:**
1. Make sure `style.css` is in the same directory as `streamlit_app.py`
2. Check that the file path in `load_css()` is correct
3. Try adding the CSS directly in the app using `st.markdown`

### Missing Files

**Issue:** The app can't find certain files

**Solution:**
1. Verify that all necessary files are in your repository
2. Check file paths in your code
3. Make sure file names match exactly (case-sensitive)

## Getting More Help

If you're still experiencing issues:

1. Check the [Streamlit documentation](https://docs.streamlit.io/)
2. Visit the [Streamlit community forum](https://discuss.streamlit.io/)
3. Check the [LangChain documentation](https://python.langchain.com/docs/get_started/introduction)
4. Open an issue on the GitHub repository
5. Try the simplified version of the app first to isolate the issue