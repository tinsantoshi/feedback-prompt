import streamlit as st
import os
import sys
import json
from datetime import datetime

# Set page configuration
st.set_page_config(
    page_title="LangChain Prompt Feedback Tool",
    page_icon="✨",
    layout="wide"
)

# Load custom CSS
def load_css():
    try:
        with open("style.css") as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)
    except:
        pass

# Try to load CSS
load_css()

# App title and description
st.title("✨ LangChain Prompt Feedback Tool")
st.markdown("""
This tool helps you improve your prompts for LLMs by providing real-time feedback.
Type your prompt in the text area below and receive instant feedback on its quality.
""")

# Initialize session state for history
if 'history' not in st.session_state:
    st.session_state.history = []

# Handle LangChain imports with compatibility for different versions
try:
    # Try importing from langchain_community (newer versions)
    from langchain_community.chat_models import ChatOpenAI
    from langchain_community.llms import OpenAI
    st.sidebar.success("✅ Using LangChain Community modules")
except ImportError:
    try:
        # Try importing from langchain (older versions)
        from langchain.chat_models import ChatOpenAI
        from langchain.llms import OpenAI
        st.sidebar.success("✅ Using LangChain legacy modules")
    except ImportError:
        st.error("""
        Failed to import LangChain modules. 
        
        Please make sure you have installed either:
        1. `langchain` and `langchain_community` (for newer versions)
        2. `langchain` (for older versions)
        
        Run: `pip install langchain langchain_community`
        """)
        st.stop()

# Import our component - handle both direct import and relative import scenarios
try:
    # Try to import directly (when installed as a package)
    from langchain_prompt_feedback import PromptFeedbackChain, createFeedbackCriteria
    direct_import = True
except ImportError:
    try:
        # Try to import from src directory (when in the repository)
        sys.path.append(".")
        from src.PromptFeedbackChain import PromptFeedbackChain
        from src.utils import createFeedbackCriteria
        direct_import = False
    except ImportError:
        # Try to use the adapter
        try:
            from adapter import get_prompt_feedback_chain, get_feedback_criteria_creator
            PromptFeedbackChain = get_prompt_feedback_chain()
            createFeedbackCriteria = get_feedback_criteria_creator()
            direct_import = True
        except ImportError:
            st.error("""
            Failed to import the LangChain Prompt Feedback Component. 
            
            Please make sure you have either:
            1. Installed the package using `pip install langchain-prompt-feedback`
            2. Cloned the repository and are running this app from the repository root
            
            Check the deployment guide for more information.
            """)
            st.stop()

# Sidebar for configuration
st.sidebar.title("Configuration")

# API Key input - check for secrets first
api_key = None

# Try to get API key from secrets
try:
    if hasattr(st.secrets, "openai") and "api_key" in st.secrets.openai:
        api_key = st.secrets.openai.api_key
        st.sidebar.success("✅ Using API key from secrets")
    else:
        api_key = st.sidebar.text_input("OpenAI API Key", type="password", 
                                      help="Enter your OpenAI API key. It will not be stored.")
except:
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

# LLM model selection (only show if use_llm is checked)
llm_model = "gpt-3.5-turbo"
if use_llm:
    llm_model = st.sidebar.selectbox(
        "Select LLM Model",
        ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"],
        index=0,
        help="Select the OpenAI model to use for feedback"
    )

# Debounce time
debounce_time = st.sidebar.slider(
    "Debounce Time (ms)",
    min_value=100,
    max_value=1000,
    value=300,
    step=100,
    help="Time to wait after typing stops before processing feedback"
)

# Create feedback criteria
if direct_import:
    criteria = createFeedbackCriteria({
        "clarity": clarity,
        "context": context,
        "constraints": constraints,
        "examples": examples,
        "format": format
    })
else:
    criteria = {
        "clarity": clarity,
        "context": context,
        "constraints": constraints,
        "examples": examples,
        "format": format
    }

# Main content - two columns layout
col1, col2 = st.columns([3, 2])

with col1:
    st.subheader("Your Prompt")
    prompt_input = st.text_area(
        "Enter your prompt:",
        height=200,
        placeholder="Type your prompt here. For example: Explain the concept of quantum computing to a high school student..."
    )

    # Process button
    process_button = st.button("Get Feedback")

# Function to get feedback (with caching)
@st.cache_data(ttl=300)
def get_feedback(prompt, criteria_json, use_llm_param, llm_model_param, api_key_param):
    """Get feedback for a prompt with caching"""
    if api_key_param:
        os.environ["OPENAI_API_KEY"] = api_key_param
    
    # Convert criteria from JSON string back to dict
    criteria_dict = json.loads(criteria_json)
    
    # Create the feedback chain
    if direct_import:
        feedback_chain = PromptFeedbackChain({
            "criteria": criteria_dict,
            "useLLM": use_llm_param,
            "debounceTime": 300,
            "llmModel": llm_model_param if use_llm_param else None
        })
    else:
        feedback_chain = PromptFeedbackChain({
            "criteria": criteria_dict,
            "useLLM": use_llm_param,
            "debounceTime": 300,
            "llmModel": llm_model_param if use_llm_param else None
        })
    
    # Get feedback
    result = feedback_chain.call({"input": prompt})
    return result.get("feedback", {})

# Process the prompt if button is clicked
if process_button:
    if not prompt_input.strip():
        st.error("Please enter a prompt to receive feedback.")
    else:
        if use_llm and not api_key:
            st.error("Please enter your OpenAI API key to use LLM-based feedback.")
        else:
            with st.spinner("Analyzing your prompt..."):
                try:
                    # Convert criteria to JSON string for caching
                    criteria_json = json.dumps(criteria)
                    
                    # Get feedback with caching
                    feedback = get_feedback(
                        prompt_input, 
                        criteria_json, 
                        use_llm, 
                        llm_model if use_llm else None,
                        api_key
                    )
                    
                    # Save to history
                    history_item = {
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "original_prompt": prompt_input,
                        "score": feedback.get("score", 0),
                        "strengths": feedback.get("strengths", []),
                        "weaknesses": feedback.get("weaknesses", []),
                        "suggestions": feedback.get("suggestions", []),
                        "improved_prompt": feedback.get("improvedPrompt", "")
                    }
                    st.session_state.history.append(history_item)
                    
                    # Display feedback in the second column
                    with col2:
                        st.subheader("Prompt Feedback")
                        
                        # Score with color coding and CSS classes
                        score = feedback.get("score", 0)
                        score_class = "score-low" if score < 50 else "score-medium" if score < 75 else "score-high"
                        score_color = "red" if score < 50 else "orange" if score < 75 else "green"
                        
                        # Use HTML for better styling
                        st.markdown(f"""
                        <div class="score-container {score_class}">
                            <h3>Score: <span style="color:{score_color}">{score}/100</span></h3>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # Strengths
                        if strengths := feedback.get("strengths", []):
                            st.markdown("### Strengths:")
                            for strength in strengths:
                                st.markdown(f"""
                                <div class="feedback-item strength">
                                    ✅ {strength}
                                </div>
                                """, unsafe_allow_html=True)
                        
                        # Weaknesses
                        if weaknesses := feedback.get("weaknesses", []):
                            st.markdown("### Areas for Improvement:")
                            for weakness in weaknesses:
                                st.markdown(f"""
                                <div class="feedback-item weakness">
                                    🔍 {weakness}
                                </div>
                                """, unsafe_allow_html=True)
                        
                        # Suggestions
                        if suggestions := feedback.get("suggestions", []):
                            st.markdown("### Suggestions:")
                            for suggestion in suggestions:
                                st.markdown(f"""
                                <div class="feedback-item suggestion">
                                    💡 {suggestion}
                                </div>
                                """, unsafe_allow_html=True)
                        
                        # Improved prompt
                        if improved_prompt := feedback.get("improvedPrompt"):
                            st.markdown("### Improved Prompt:")
                            st.text_area("", value=improved_prompt, height=150, disabled=True, key="improved_prompt")
                            if st.button("Use This Improved Prompt"):
                                prompt_input = improved_prompt
                                st.experimental_rerun()
                
                except Exception as e:
                    st.error(f"An error occurred: {str(e)}")
                    st.error("If you're using LLM-based feedback, please check your API key.")

# Display history in an expander
with st.expander("Prompt History"):
    if st.session_state.history:
        # Add a button to clear history
        if st.button("Clear History"):
            st.session_state.history = []
            st.experimental_rerun()
        
        # Display history items in reverse order (newest first)
        for i, item in enumerate(reversed(st.session_state.history)):
            # Use HTML for better styling
            st.markdown(f"""
            <div class="history-item">
                <h4>Prompt {len(st.session_state.history) - i}</h4>
                <p><strong>Time:</strong> {item['timestamp']}</p>
                <p><strong>Score:</strong> {item['score']}/100</p>
                <p><strong>Original:</strong> {item['original_prompt'][:100]}{"..." if len(item['original_prompt']) > 100 else ""}</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Expandable details
            with st.expander("View Details"):
                st.markdown("**Original Prompt:**")
                st.text_area("", value=item['original_prompt'], height=100, disabled=True, key=f"orig_{i}")
                
                if item['improved_prompt']:
                    st.markdown("**Improved Prompt:**")
                    st.text_area("", value=item['improved_prompt'], height=100, disabled=True, key=f"imp_{i}")
                    
                    # Button to use this prompt
                    if st.button("Use This Prompt", key=f"use_{i}"):
                        prompt_input = item['improved_prompt']
                        st.experimental_rerun()
    else:
        st.write("No history yet. Get feedback on prompts to build history.")

# Footer
st.markdown("---")
st.markdown("""
<footer>
    <p>Built with ❤️ using LangChain and Streamlit</p>
    <p><a href="https://github.com/tinsantoshi/feedback-prompt" target="_blank">GitHub Repository</a> | <a href="FAQ.md" target="_blank">FAQ</a></p>
</footer>
""", unsafe_allow_html=True)