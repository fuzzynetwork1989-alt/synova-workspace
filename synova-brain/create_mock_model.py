"""
Create Mock Trained Model for Testing
"""
import json
import os
from datetime import datetime

def create_mock_model():
    """Create a mock trained model for testing"""
    print("🧠 Creating Mock Trained Model...")
    
    output_dir = "synova-brain-mock"
    os.makedirs(output_dir, exist_ok=True)
    
    # Create mock model files
    mock_config = {
        "model_type": "synova-brain-v3.2",
        "training_data": "XR architecture conversations",
        "capabilities": [
            "blueprint_generation",
            "code_generation", 
            "voice_commands",
            "app_deployment"
        ],
        "created_at": datetime.now().isoformat()
    }
    
    # Save config
    with open(os.path.join(output_dir, "config.json"), 'w') as f:
        json.dump(mock_config, f, indent=2)
    
    # Create Modelfile
    modelfile_content = f"""FROM {output_dir}

TEMPLATE \"\"\"{{%{{ if .System }}}<|im_start|>system
Synova Brain v3.2: Autonomous XR architect + app factory{{%{{ .System }}}<|im_end|>
{{%{{ end }}}%{{%{{ if .Prompt }}}<|im_start|>user
{{%{{ .Prompt }}}<|im_end|>
{{%{{ end }}}<|im_start|>assistant
\"\"\"

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 50
PARAMETER stop "<|im_end|>"
PARAMETER num_ctx 4096

SYSTEM You are Synova Brain v3.2, an autonomous AI architect specialized in XR/VR/AR design, 3D modeling, and rapid app deployment.
"""
    
    modelfile_path = os.path.join(output_dir, "Modelfile")
    with open(modelfile_path, 'w') as f:
        f.write(modelfile_content)
    
    print(f"✅ Mock model created: {output_dir}")
    print(f"✅ Modelfile created: {modelfile_path}")
    print("\n🎉 MOCK TRAINING COMPLETED!")
    print(f"🚀 Deploy with: ollama create synova-brain -f {modelfile_path}")
    
    return output_dir

if __name__ == "__main__":
    create_mock_model()
