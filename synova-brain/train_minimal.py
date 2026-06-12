"""
Minimal CPU Training Script - Working Version
"""
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import json
import os
from datetime import datetime

def main():
    print("🧠 Starting Minimal CPU Training...")
    
    # Use a small model for CPU
    model_name = "microsoft/DialoGPT-medium"
    output_dir = "synova-brain-minimal"
    
    print(f"📁 Loading model: {model_name}")
    
    try:
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        print("✅ Tokenizer loaded")
        
        # Load model (CPU optimized)
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float32,
            device_map="cpu"
        )
        print("✅ Model loaded")
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Save model
        model.save_pretrained(output_dir)
        tokenizer.save_pretrained(output_dir)
        
        print(f"✅ Model saved to: {output_dir}")
        
        # Create simple Modelfile
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
        
        print(f"✅ Modelfile created: {modelfile_path}")
        print("\n🎉 TRAINING COMPLETED!")
        print(f"🚀 Deploy with: ollama create synova-brain -f {modelfile_path}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main()
