"""
Adapter module for connecting the LangChain Prompt Feedback Component to the Streamlit app.
This handles different import scenarios and provides a consistent interface.
"""

import sys
import os
import importlib.util

class ComponentAdapter:
    """Adapter for the LangChain Prompt Feedback Component"""
    
    def __init__(self):
        """Initialize the adapter and detect the component location"""
        self.direct_import = False
        self.component_available = False
        self.import_path = None
        
        # Try to detect the component
        self._detect_component()
    
    def _detect_component(self):
        """Detect how to import the component"""
        # Try direct import (installed package)
        try:
            import langchain_prompt_feedback
            self.direct_import = True
            self.component_available = True
            self.import_path = "package"
            return
        except ImportError:
            pass
        
        # Try relative import (repository structure)
        paths_to_check = [
            ".",  # Current directory
            "..",  # Parent directory
            "../..",  # Grandparent directory
            "src",  # src directory
            "../src",  # Parent's src directory
        ]
        
        for path in paths_to_check:
            # Check if the path exists and contains the necessary files
            if os.path.exists(os.path.join(path, "src")):
                if os.path.exists(os.path.join(path, "src", "PromptFeedbackChain.ts")) or \
                   os.path.exists(os.path.join(path, "src", "PromptFeedbackChain.js")) or \
                   os.path.exists(os.path.join(path, "src", "PromptFeedbackChain.py")):
                    sys.path.append(os.path.abspath(path))
                    self.direct_import = False
                    self.component_available = True
                    self.import_path = path
                    return
    
    def get_prompt_feedback_chain(self):
        """Get the PromptFeedbackChain class"""
        if not self.component_available:
            raise ImportError("LangChain Prompt Feedback Component not found")
        
        if self.direct_import:
            from langchain_prompt_feedback import PromptFeedbackChain
            return PromptFeedbackChain
        else:
            try:
                # Try Python implementation
                from src.PromptFeedbackChain import PromptFeedbackChain
                return PromptFeedbackChain
            except ImportError:
                # If that fails, try to load from compiled JavaScript
                raise ImportError("Could not import PromptFeedbackChain. Make sure the component is properly installed.")
    
    def get_feedback_criteria_creator(self):
        """Get the function to create feedback criteria"""
        if not self.component_available:
            raise ImportError("LangChain Prompt Feedback Component not found")
        
        if self.direct_import:
            from langchain_prompt_feedback import createFeedbackCriteria
            return createFeedbackCriteria
        else:
            try:
                # Try to import from utils
                from src.utils import createFeedbackCriteria
                return createFeedbackCriteria
            except ImportError:
                # If that fails, return a simple function that just returns the input
                return lambda criteria: criteria
    
    def is_available(self):
        """Check if the component is available"""
        return self.component_available
    
    def get_import_info(self):
        """Get information about how the component was imported"""
        if not self.component_available:
            return "Component not found"
        
        if self.direct_import:
            return "Imported from installed package"
        else:
            return f"Imported from {self.import_path}"


# Create a singleton instance
adapter = ComponentAdapter()

# Convenience functions
def get_prompt_feedback_chain():
    """Get the PromptFeedbackChain class"""
    return adapter.get_prompt_feedback_chain()

def get_feedback_criteria_creator():
    """Get the function to create feedback criteria"""
    return adapter.get_feedback_criteria_creator()

def is_component_available():
    """Check if the component is available"""
    return adapter.is_available()

def get_import_info():
    """Get information about how the component was imported"""
    return adapter.get_import_info()