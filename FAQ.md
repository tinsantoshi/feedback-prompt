# Frequently Asked Questions (FAQ)

## General Questions

### What is the LangChain Prompt Feedback Component?
The LangChain Prompt Feedback Component is a tool that provides real-time feedback on prompts for large language models. It helps users craft more effective prompts by analyzing various aspects of prompt quality and providing suggestions for improvement.

### What is Streamlit Cloud?
Streamlit Cloud is a free hosting service for Streamlit apps. It allows you to deploy your Streamlit applications directly from GitHub repositories without needing to set up servers or infrastructure.

## Setup & Installation

### Do I need to install anything to use the deployed app?
No, once the app is deployed to Streamlit Cloud, users can access it through a web browser without installing anything.

### What prerequisites do I need to deploy the app myself?
You need:
- A GitHub account
- A Streamlit Cloud account (free, sign up with your GitHub account)
- An OpenAI API key (for LLM-based feedback)

### How do I get an OpenAI API key?
1. Go to [OpenAI's website](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to the API section
4. Create a new API key
5. Copy the key (you'll only see it once)

### Is there a cost to using this app?
- Streamlit Cloud offers free hosting for public repositories
- OpenAI charges for API usage based on their pricing model
- The app itself is free and open-source

## Deployment

### How long does deployment take?
Typically, deployment takes 1-5 minutes on Streamlit Cloud.

### Can I update my app after deployment?
Yes! Any changes pushed to your GitHub repository will automatically trigger a redeployment on Streamlit Cloud.

### How do I add my API key securely?
Use Streamlit Cloud's secrets management:
1. Go to your app on Streamlit Cloud
2. Click the three dots menu (⋮) in the top-right corner
3. Select "Settings"
4. Click on "Secrets"
5. Add your API key in the format:
   ```yaml
   openai:
     api_key: "your-api-key-here"
   ```

### Can I deploy this app on my own server instead of Streamlit Cloud?
Yes, you can run the Streamlit app on any server that supports Python. Just install the requirements and run `streamlit run streamlit_app.py`.

## Using the App

### What criteria does the app use to evaluate prompts?
The app evaluates prompts based on:
- **Clarity**: Is the prompt clear and specific?
- **Context**: Does it provide necessary context?
- **Constraints**: Does it specify constraints?
- **Examples**: Does it include examples if needed?
- **Format**: Does it specify desired output format?

### Can I use the app without an OpenAI API key?
Yes, but with limitations. Without an API key, the app will use only heuristic evaluation, which is less comprehensive than LLM-based evaluation.

### What's the difference between heuristic and LLM-based evaluation?
- **Heuristic evaluation**: Uses rule-based algorithms to check basic prompt quality metrics. It's faster but less nuanced.
- **LLM-based evaluation**: Uses an LLM to provide more detailed and contextual feedback. It's more comprehensive but requires an API key.

### How accurate is the feedback?
The feedback is based on best practices for prompt engineering, but it's not perfect. Always use your judgment when applying the suggestions.

## Troubleshooting

### The app shows an error after deployment
Check the logs in Streamlit Cloud by:
1. Going to your app
2. Clicking the three dots menu (⋮)
3. Selecting "Manage app"
4. Clicking on "Logs"

Common issues include:
- Missing dependencies
- API key configuration issues
- File path problems

### My API key isn't working
Verify that:
- The key is entered correctly in the secrets management
- Your OpenAI account has sufficient credits
- The key is active in your OpenAI dashboard

### The app is running slowly
This could be due to:
- High traffic on Streamlit Cloud
- Slow responses from the OpenAI API
- Complex prompts requiring more processing time

Try:
- Using heuristic evaluation instead of LLM-based evaluation
- Keeping prompts concise
- Checking at a different time

## Development & Customization

### Can I modify the app for my own needs?
Absolutely! The code is open-source and can be modified. Common customizations include:
- Adding new evaluation criteria
- Changing the UI design
- Integrating with other LLM providers

### How do I add custom evaluation criteria?
Modify the `criteria` object in the Streamlit app to include your custom criteria, then update the evaluation logic in the feedback component.

### Can I use a different LLM provider?
Yes, but you'll need to modify the code to use a different provider's API instead of OpenAI.

## Getting Help

### Where can I get more help?
- Check the [Streamlit documentation](https://docs.streamlit.io/)
- Visit the [Streamlit community forum](https://discuss.streamlit.io/)
- Check the [LangChain documentation](https://python.langchain.com/docs/get_started/introduction)
- Open an issue on the GitHub repository

### Can I contribute to this project?
Yes! Contributions are welcome. Fork the repository, make your changes, and submit a pull request.