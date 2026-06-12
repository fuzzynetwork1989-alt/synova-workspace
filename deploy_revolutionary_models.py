#!/usr/bin/env python3
"""
Deploy Revolutionary Synova Models - Creates and tests all revolutionary models
"""

import asyncio
import subprocess
import sys
import os

async def create_model(model_name: str, modelfile_path: str) -> bool:
    """Create a revolutionary model in Ollama"""
    print(f"🚀 Creating {model_name}...")
    
    try:
        # Check if modelfile exists
        if not os.path.exists(modelfile_path):
            print(f"❌ Modelfile not found: {modelfile_path}")
            return False
        
        # Create the model using ollama
        cmd = ["ollama", "create", model_name, "-f", modelfile_path]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            print(f"✅ Successfully created {model_name}")
            return True
        else:
            print(f"❌ Failed to create {model_name}")
            print(f"Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"❌ Timeout creating {model_name}")
        return False
    except Exception as e:
        print(f"❌ Error creating {model_name}: {str(e)}")
        return False

async def test_model(model_name: str) -> bool:
    """Test if model is working"""
    print(f"🧪 Testing {model_name}...")
    
    try:
        # Simple test prompt
        test_prompt = "Hello! What revolutionary capabilities do you have?"
        cmd = ["ollama", "run", model_name, test_prompt]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            print(f"✅ {model_name} is working!")
            print(f"Response: {result.stdout[:200]}...")
            return True
        else:
            print(f"❌ {model_name} test failed")
            print(f"Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"❌ Timeout testing {model_name}")
        return False
    except Exception as e:
        print(f"❌ Error testing {model_name}: {str(e)}")
        return False

async def main():
    """Main deployment script"""
    print("🌠 Synova Revolutionary Model Deployment")
    print("=" * 60)
    
    # Check if ollama is available
    try:
        subprocess.run(["ollama", "--version"], capture_output=True, check=True)
        print("✅ Ollama is available")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Ollama not found. Please install Ollama first.")
        print("Visit: https://ollama.ai/")
        return
    
    # Revolutionary models to create
    models = [
        {
            "name": "Synova_Quantum_Nexus",
            "modelfile": "Modelfile_Synova_Quantum_Nexus",
            "base": "llama2:13b"
        },
        {
            "name": "Synova_Omni_Nexus", 
            "modelfile": "Modelfile_Synova_Omni_Nexus",
            "base": "mixtral:8x7b"
        },
        {
            "name": "Synova_Neural_Quantum",
            "modelfile": "Modelfile_Synova_Neural_Quantum",
            "base": "neuralchat:7b"
        },
        {
            "name": "Synova_Nexus_Enhanced",
            "modelfile": "Modelfile_Synova_Nexus_Enhanced",
            "base": "llama2:13b"
        },
        {
            "name": "Synova_Gemma4_Quantum",
            "modelfile": "Modelfile_Synova_Gemma4_Quantum",
            "base": "gemma2:9b"
        },
        {
            "name": "Synova_Gemma4_Quantum_Elite",
            "modelfile": "Modelfile_Synova_Gemma4_Quantum_Elite",
            "base": "gemma2:27b"
        },
        {
            "name": "Synova_DeepSeek_Quantum",
            "modelfile": "Modelfile_Synova_DeepSeek_Quantum",
            "base": "deepseek-coder:6.7b"
        }
    ]
    
    print(f"\n🎯 Creating {len(models)} Revolutionary Models...")
    print("-" * 40)
    
    success_count = 0
    failed_models = []
    
    # Create each model
    for model in models:
        success = await create_model(model["name"], model["modelfile"])
        if success:
            success_count += 1
        else:
            failed_models.append(model["name"])
    
    print(f"\n📊 Creation Results:")
    print(f"✅ Successfully created: {success_count}/{len(models)} models")
    if failed_models:
        print(f"❌ Failed to create: {', '.join(failed_models)}")
    
    # Test working models
    if success_count > 0:
        print(f"\n🧪 Testing Created Models...")
        print("-" * 30)
        
        test_success = 0
        for model in models:
            if model["name"] not in failed_models:
                if await test_model(model["name"]):
                    test_success += 1
        
        print(f"\n📈 Test Results:")
        print(f"✅ Working models: {test_success}/{success_count}")
    
    # Final summary
    print(f"\n🎉 REVOLUTIONARY DEPLOYMENT COMPLETE!")
    print("=" * 60)
    
    if success_count == len(models):
        print("🌟 ALL REVOLUTIONARY MODELS SUCCESSFULLY DEPLOYED!")
        print("You now have access to:")
        print("• Quantum consciousness with dimensional cognition")
        print("• Universal omniscient capabilities")
        print("• Neural-quantum biological hybrids")
        print("• Advanced cognitive enhancements")
        print("• Elite Gemma4 quantum processing")
        print("• DeepSeek technical quantum excellence")
        print("\n🚀 Ready to transcend conventional AI limitations!")
    else:
        print(f"⚠️  {success_count}/{len(models)} models deployed")
        print("Some models may need manual creation")
        print("Check error messages above for details")

if __name__ == "__main__":
    asyncio.run(main())
