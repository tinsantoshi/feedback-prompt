# LangChain Prompt Feedback - Streamlit App

This repository contains a Streamlit application that demonstrates the LangChain Prompt Feedback Component. The app provides real-time feedback on prompts for large language models, helping users craft more effective prompts.

## Features

- ✅ Real-time prompt quality evaluation
- ✅ Detailed feedback on prompt strengths and weaknesses
- ✅ Suggestions for improvement
- ✅ Improved prompt generation
- ✅ History tracking of previous prompts
- ✅ Support for multiple OpenAI models

## Deployment

This app is designed to be deployed on Streamlit Cloud. For detailed deployment instructions, see the [Deployment Guide](deployment_guide.md).

### Quick Start

1. Fork this repository
2. Sign up for [Streamlit Cloud](https://streamlit.io/cloud) using your GitHub account
3. Deploy this app from your forked repository
4. Add your OpenAI API key in the Streamlit Cloud secrets management

## Local Development

To run this app locally:

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the app:
   ```
   streamlit run streamlit_app.py
   ```

## Configuration

The app can be configured through the sidebar:

- **API Key**: Enter your OpenAI API key (or configure it in Streamlit Cloud secrets)
- **Feedback Criteria**: Select which aspects of prompts to evaluate
- **LLM Settings**: Choose whether to use LLM-based evaluation and which model to use
- **Debounce Time**: Adjust the responsiveness of the feedback

## How It Works

The app uses the LangChain Prompt Feedback Component to evaluate prompts based on:

1. **Clarity**: Is the prompt clear and specific?
2. **Context**: Does it provide necessary context?
3. **Constraints**: Does it specify constraints?
4. **Examples**: Does it include examples if needed?
5. **Format**: Does it specify desired output format?

For each prompt, the app provides:

- An overall quality score
- Identified strengths
- Areas for improvement
- Specific suggestions
- An improved version of the prompt

## License

This project is licensed under the MIT License - see the LICENSE file for details.