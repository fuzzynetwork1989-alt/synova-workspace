"""
Synova Brain v3.2 CPU Training Pipeline
Production-ready training script for CPU environments
"""

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, TextDataset, DataCollatorForLanguageModeling
from transformers import Trainer, TrainingArguments
import json
import os
from datetime import datetime

class SynovaBrainCPUTrainer:
    def __init__(self, model_name="microsoft/DialoGPT-medium"):
        self.model_name = model_name
        self.max_seq_length = 512
        self.device = "cpu"

    def load_model(self):
        """Load the base model for CPU training"""
        print(f"🧠 Loading Synova Brain v3.2 base model: {self.model_name}")

        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            device_map="cpu",
            torch_dtype=torch.float32
        )

        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_name,
            padding_side='left'
        )

        # Set pad token if not present
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

        print("✅ Base model loaded successfully")
        return self.model, self.tokenizer

    def load_training_data(self, data_path="synova-training-data.json"):
        """Load and prepare training dataset"""
        print(f"📚 Loading training data from {data_path}")

        if not os.path.exists(data_path):
            print("📝 Creating sample training dataset...")
            self.create_sample_dataset(data_path)

        # Load JSON data
        with open(data_path, 'r') as f:
            training_data = json.load(f)

        # Convert to training format
        formatted_data = []
        for item in training_data:
            formatted_text = f"User: {item['input']}\nAssistant: {item['output']}"
            formatted_data.append(formatted_text)

        # Create text file for training
        train_file = "synova_train.txt"
        with open(train_file, 'w') as f:
            for text in formatted_data:
                f.write(text + "\n\n")

        # Create dataset
        dataset = TextDataset(
            tokenizer=self.tokenizer,
            file_path=train_file,
            block_size=self.max_seq_length
        )

        print(f"✅ Dataset loaded: {len(dataset)} examples")
        return dataset

    def create_sample_dataset(self, data_path):
        """Create sample XR architecture conversations"""
        sample_conversations = [
            {
                "input": "Build me a modern industrial warehouse with mezzanine offices",
                "output": "I'll create a 50x100m industrial warehouse with steel I-beam framing, reinforced concrete foundation, and mezzanine lofts. The design includes roll-up doors, skylights for natural lighting, and climate-controlled office spaces. The GLTF blueprint is ready for Quest rendering."
            },
            {
                "input": "Show luxury home with infinity pool",
                "output": "I'll design a $1.2M modern estate featuring a 40x12ft infinity edge pool, smart glass walls, wine cellar for 1,000 bottles, and a 4K home theater. The 5,000 sq ft layout includes 5 bedrooms, 6 bathrooms, and holo-furnishings AR preview capability."
            },
            {
                "input": "Create urban lofts for mixed-use development",
                "output": "I'll design 4-story urban lofts with 12 residential units, featuring glass curtain walls, rooftop deck, ground-floor retail spaces, and fitness center. The low-e glass and exposed concrete materials create modern aesthetics while maintaining energy efficiency."
            },
            {
                "input": "Voice command: Show warehouse blueprint",
                "output": "Voice command detected. Generating industrial warehouse blueprint with 50x100m dimensions, steel frame structure, mezzanine offices, and roll-up doors. GLTF file rendering in Babylon.js for real-time 3D visualization."
            },
            {
                "input": "Deploy XR app to Meta Quest store",
                "output": "Initiating automated deployment pipeline. Building APK with EAS Build, configuring Quest 3 optimizations, preparing store submission with VR navigation and holo-rendering capabilities. Estimated deployment time: 15 minutes."
            }
        ]

        with open(data_path, 'w') as f:
            json.dump(sample_conversations, f, indent=2)

        print(f"✅ Created sample dataset with {len(sample_conversations)} conversations")

    def train_model(self, dataset, output_dir="synova-brain-cpu"):
        """Train the model with CPU optimization"""
        print("🚀 Starting Synova Brain v3.2 CPU training...")

        data_collator = DataCollatorForLanguageModeling(
            tokenizer=self.tokenizer,
            mlm=False,
        )

        training_args = TrainingArguments(
            output_dir=output_dir,
            overwrite_output_dir=True,
            num_train_epochs=3,
            per_device_train_batch_size=1,
            gradient_accumulation_steps=4,
            warmup_steps=100,
            weight_decay=0.01,
            logging_dir=f"{output_dir}/logs",
            logging_steps=10,
            save_steps=500,
            save_total_limit=2,
            prediction_loss_only=True,
            fp16=False,  # CPU doesn't support fp16
            dataloader_num_workers=0,  # CPU optimization
            remove_unused_columns=False,
        )

        trainer = Trainer(
            model=self.model,
            args=training_args,
            data_collator=data_collator,
            train_dataset=dataset,
        )

        print("📊 Training started...")
        trainer.train()

        # Save model
        model_path = f"{output_dir}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        self.model.save_pretrained(model_path)
        self.tokenizer.save_pretrained(model_path)

        print(f"✅ Training completed! Model saved to {model_path}")
        return model_path

    def create_modelfile(self, model_path):
        """Create Ollama Modelfile for deployment"""
        template_lines = [
            f"FROM {model_path}",
            "",
            'TEMPLATE """',
            "{{% if .System %}}\u2764 Synova Brain v3.2: Autonomous XR architect + app factory{{% .System %}}\u2764",
            "{{% end %}}{{% if .Prompt %}}\u2764 Assistant \u2764",
            "{{% .Prompt %}}\u2764",
            "{{% end %}}\u2764 User \u2764",
            '"""',
            "",
            "PARAMETER temperature 0.7",
            "PARAMETER top_p 0.9",
            "PARAMETER top_k 50",
            "PARAMETER repeat_penalty 1.1",
            'PARAMETER stop "\u2764"',
            "PARAMETER num_ctx 4096",
            "",
            "SYSTEM You are Synova Brain v3.2, an autonomous AI architect specialized in XR/VR/AR design, 3D modeling, and rapid app deployment. You excel at creating architectural blueprints, holo-renderings, and voice-controlled interfaces."
        ]

        modelfile_content = '\n'.join(template_lines)

        modelfile_path = os.path.join(model_path, "Modelfile")
        with open(modelfile_path, 'w') as f:
            f.write(modelfile_content)

        print(f"✅ Ollama Modelfile created: {modelfile_path}")
        return modelfile_path

def main():
    """Main CPU training pipeline"""
    print("🧠 SYNOVA BRAIN v3.2 CPU TRAINING PIPELINE")
    print("=" * 50)

    # Initialize trainer
    trainer = SynovaBrainCPUTrainer()

    # Load model
    model, tokenizer = trainer.load_model()

    # Load training data
    dataset = trainer.load_training_data()

    # Train model
    model_path = trainer.train_model(dataset)

    # Create Ollama Modelfile
    modelfile_path = trainer.create_modelfile(model_path)

    print("\n🎉 SYNOVA BRAIN v3.2 CPU TRAINING COMPLETED!")
    print(f"📁 Model: {model_path}")
    print(f"📄 Modelfile: {modelfile_path}")
    print("\n🚀 Deploy to Ollama:")
    print(f"   ollama create synova-brain -f {modelfile_path}")
    print("   ollama run synova-brain")

if __name__ == "__main__":
    main()
