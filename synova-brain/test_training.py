#!/usr/bin/env python3
"""Test CPU Training Script"""
import sys
import os
sys.path.append(os.path.dirname(__file__))

from train_cpu import SynovaBrainCPUTrainer

def test_training():
    """Test the CPU training pipeline"""
    print("🧪 Testing CPU Training Pipeline...")
    
    try:
        # Initialize trainer
        trainer = SynovaBrainCPUTrainer()
        print("✅ Trainer initialized")
        
        # Test model loading
        model, tokenizer = trainer.load_model()
        print("✅ Model loaded successfully")
        
        # Test data loading
        dataset = trainer.load_training_data()
        print(f"✅ Dataset loaded: {len(dataset)} examples")
        
        print("🎉 CPU Training Pipeline Test PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        return False

if __name__ == "__main__":
    success = test_training()
    if success:
        print("\n🚀 Ready for full training run!")
        print("Run: python train_cpu.py")
    else:
        print("\n❌ Fix errors before training")
