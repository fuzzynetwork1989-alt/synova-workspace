#!/usr/bin/env python3
"""
Synova Brain Integration Test
Test the AI brain integration with Core API
"""

try:
    from synova_brain import SynovaBrainCPU
    print("🧠 Testing Synova Brain v3.2 Integration...")
    
    # Initialize brain
    brain = SynovaBrainCPU()
    brain.load_model()
    print("✅ Synova Brain loaded successfully")
    
    # Test responses
    test_prompts = [
        "Design a modern office building",
        "Create VR showroom for cars", 
        "Build smart home automation"
    ]
    
    print("\n🧪 Running AI Tests:")
    for i, prompt in enumerate(test_prompts, 1):
        print(f"\n📝 Test {i}: {prompt}")
        try:
            response = brain.generate_response(prompt)
            print(f"🤖 Response: {response[:100]}...")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n🎉 Synova Brain integration test completed!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please ensure synova-brain dependencies are installed")
except Exception as e:
    print(f"❌ Setup error: {e}")
