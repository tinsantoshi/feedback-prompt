# Visual Guide: Deploying to Streamlit Cloud

This visual guide walks you through the process of deploying the LangChain Prompt Feedback app to Streamlit Cloud, with screenshots for each step.

## Step 1: Fork the GitHub Repository

1. Go to the GitHub repository: https://github.com/tinsantoshi/feedback-prompt
2. Click the "Fork" button in the top-right corner

![Fork Repository](https://i.imgur.com/8YZy1Jb.png)

3. Wait for the repository to be forked to your account

## Step 2: Sign Up for Streamlit Cloud

1. Go to [Streamlit Cloud](https://streamlit.io/cloud)
2. Click "Sign in with GitHub"

![Sign in with GitHub](https://i.imgur.com/JGkDnJL.png)

3. Authorize Streamlit to access your GitHub account

## Step 3: Deploy Your App

1. Once signed in, click "New app" in the Streamlit Cloud dashboard

![New App](https://i.imgur.com/8nJJHtG.png)

2. Select your repository, branch, and main file path:
   - Repository: Select your forked repository
   - Branch: main
   - Main file path: streamlit_app.py

![Deploy Settings](https://i.imgur.com/YfQJQjp.png)

3. Click "Deploy"

4. Wait for the deployment to complete (this may take a few minutes)

![Deployment Progress](https://i.imgur.com/ZLQPzLw.png)

## Step 4: Configure Secrets (for API Keys)

1. Once your app is deployed, click on the three dots menu (⋮) in the top-right corner of your app
2. Select "Settings"

![App Settings](https://i.imgur.com/JYvYqRm.png)

3. Click on "Secrets"
4. Add your OpenAI API key in the following format:

```yaml
openai:
  api_key: "your-api-key-here"
```

![Secrets Management](https://i.imgur.com/8XZy1Jb.png)

5. Click "Save"

## Step 5: Access Your App

1. Your app is now deployed and accessible via the URL provided by Streamlit Cloud
2. Share this URL with others to let them use your app

![Deployed App](https://i.imgur.com/9YZy1Jb.png)

## Step 6: Make Updates (Optional)

If you want to update your app:

1. Make changes to your code in your GitHub repository
2. Commit and push the changes
3. Streamlit Cloud will automatically redeploy your app with the changes

![GitHub Commit](https://i.imgur.com/7YZy1Jb.png)

## Troubleshooting

### App Shows Error on Deployment

If your app shows an error after deployment:

1. Check the logs by clicking on the three dots menu (⋮) and selecting "Manage app"
2. Click on "Logs" to see what went wrong

![View Logs](https://i.imgur.com/6YZy1Jb.png)

### API Key Not Working

If your API key isn't working:

1. Double-check that you've added it correctly in the Secrets management
2. Ensure your OpenAI account has sufficient credits
3. Verify that the API key is active in your OpenAI dashboard

### Need More Help?

If you're still having issues:

1. Check the [Streamlit documentation](https://docs.streamlit.io/)
2. Visit the [Streamlit community forum](https://discuss.streamlit.io/)
3. Open an issue on the GitHub repository