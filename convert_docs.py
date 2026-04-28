#!/usr/bin/env python3
"""
Convert Synova documentation from Markdown to Word and PDF formats.
"""

import os
import sys
from pathlib import Path

def install_dependencies():
    """Install required dependencies if not present."""
    try:
        import pypandoc
        import markdown
    except ImportError:
        print("Installing required dependencies...")
        os.system(f"{sys.executable} -m pip install pypandoc markdown")
        print("Dependencies installed. Please run the script again.")
        sys.exit(1)

    # Download pandoc if not found
    try:
        pypandoc.get_pandoc_path()
    except:
        print("Pandoc not found. Downloading...")
        try:
            pypandoc.download_pandoc()
            print("Pandoc downloaded successfully.")
        except Exception as e:
            print(f"Failed to download pandoc: {e}")
            print("Please install pandoc manually from: https://pandoc.org/installing.html")
            sys.exit(1)

def convert_to_word(markdown_file, output_file):
    """Convert Markdown to Word format using pandoc."""
    try:
        import pypandoc

        print(f"Converting {markdown_file} to Word format...")

        # Read the markdown file
        with open(markdown_file, 'r', encoding='utf-8') as f:
            markdown_content = f.read()

        # Convert using pandoc
        pypandoc.convert_text(
            markdown_content,
            'docx',
            outputfile=output_file,
            format='md',
            extra_args=['--standalone', '--toc']
        )

        print(f"✅ Word document created: {output_file}")
        return True
    except Exception as e:
        print(f"❌ Error converting to Word: {e}")
        return False

def convert_to_pdf(word_file, output_file):
    """Convert Word to PDF format using docx2pdf (Windows)."""
    try:
        from docx2pdf import convert

        print(f"Converting {word_file} to PDF format...")

        # Convert Word to PDF
        convert(word_file, output_file)

        print(f"✅ PDF document created: {output_file}")
        return True
    except ImportError:
        print("docx2pdf not installed. Installing...")
        os.system(f"{sys.executable} -m pip install docx2pdf")
        print("Please run the script again.")
        return False
    except Exception as e:
        print(f"❌ Error converting to PDF: {e}")
        print("Note: docx2pdf requires Microsoft Word to be installed on Windows.")
        print("Alternative: Install LaTeX (MiKTeX or TeX Live) for direct PDF conversion.")
        return False

def main():
    """Main conversion function."""
    # Install dependencies
    install_dependencies()

    # File paths
    workspace_root = Path(__file__).parent
    markdown_file = workspace_root / "SYNOVA_COMPLETE_DOCUMENTATION.md"
    word_file = workspace_root / "SYNOVA_COMPLETE_DOCUMENTATION.docx"
    pdf_file = workspace_root / "SYNOVA_COMPLETE_DOCUMENTATION.pdf"

    # Check if markdown file exists
    if not markdown_file.exists():
        print(f"❌ Markdown file not found: {markdown_file}")
        sys.exit(1)

    print("=" * 60)
    print("Synova Documentation Converter")
    print("=" * 60)
    print()

    # Convert to Word
    word_success = convert_to_word(markdown_file, word_file)

    # Convert to PDF (from Word)
    pdf_success = False
    if word_success:
        pdf_success = convert_to_pdf(word_file, pdf_file)

    print()
    print("=" * 60)
    print("Conversion Summary")
    print("=" * 60)
    print(f"Word: {'✅ Success' if word_success else '❌ Failed'}")
    print(f"PDF:  {'✅ Success' if pdf_success else '❌ Failed'}")
    print()

    if word_success or pdf_success:
        print("Output files:")
        if word_success:
            print(f"  - {word_file}")
        if pdf_success:
            print(f"  - {pdf_file}")

if __name__ == "__main__":
    main()
