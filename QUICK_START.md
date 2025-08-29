# Quick Start Guide for Streamlit Cloud Deployment

This guide provides the fastest way to deploy the LangChain Prompt Feedback Component to Streamlit Cloud, addressing common issues.

## Step 1: Fork or Clone the Repository

1. Go to the GitHub repository: https://github.com/tinsantoshi/feedback-prompt
2. Fork it to your GitHub account

## Step 2: Update Key Files

Replace these files in your forked repository with the fixed versions:

1. **streamlit_app.py**: Use `streamlit_app_fixed.py` instead (rename it to `streamlit_app.py`)
2. **requirements.txt**: Make sure it includes:
   ```
   streamlit>=1.22.0
   langchain>=0.0.267
   langchain-community>=0.0.1
   openai>=0.27.8
   python-dotenv>=1.0.0
   ```

## Step 3: Deploy to Streamlit Cloud

1. Go to [Streamlit Cloud](https://streamlit.io/cloud)
2. Sign in with your GitHub account
3. Click "New app"
4. Select your forked repository
5. Set the main file path to: `streamlit_app.py`
6. Click "Deploy"

## Step 4: Add Your OpenAI API Key

1. Once deployed, go to your app settings (⋮ menu)
2. Click on "Secrets"
3. Add your API key:
   ```yaml
   openai:
     api_key: "your-api-key-here"
   ```
4. Save the changes

## Step 5: Test Your App

1. Go to your deployed app URL
2. Enter a prompt in the text area
3. Click "Get Feedback"
4. Verify that the feedback is generated correctly

## Troubleshooting

If you encounter any issues:

1. Check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide
2. Make sure you're using the fixed version of the app
3. Verify your API key is correct
4. Check the app logs in Streamlit Cloud

## Next Steps

After successful deployment:

1. Share your app URL with others
2. Customize the app to fit your needs
3. Explore additional features in the LangChain Prompt Feedback Component