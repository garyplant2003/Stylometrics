# Stylometric Steganography Module

## Module Overview
This module implements steganographic encoding using linguistic patterns and stylistic variations to embed data within text. Unlike zero-width character approaches, stylometric steganography modifies the text itself in ways that appear as natural stylistic choices.

## Design Philosophy
The stylometric encoding approach prioritizes detection resistance over encoding capacity. It works by manipulating natural language patterns such as sentence structure, word choice, and punctuation to represent binary data.

## Core Components

### Linguistic Pattern Transformation
- Modifies sentence structure to encode bits
- Manipulates punctuation, adverbs, and linguistic features
- Creates plausible deniability through natural language patterns

### Word and Pattern Libraries
- Categorized word collections (articles, adjectives, adverbs, conjunctions)
- Sentence structure patterns for various encoding states
- Transformation rules for bit representation

## Data Flow

1. **Encoding Process**:
   - Convert data string to binary representation
   - Add binary length header (16 bits)
   - Insert marker text at the beginning ("Please note...")
   - Transform sentences to encode bits based on linguistic patterns:
     - Bit 0: Simple sentence structure, fewer adverbs, periods
     - Bit 1: Complex structures, more adverbs, exclamation/question marks

2. **Decoding Process**:
   - Detect marker text presence
   - Analyze sentences for linguistic patterns
   - Extract binary data based on detected patterns
   - Parse length header and extract data portion
   - Convert binary back to string

## Technical Details

### Pattern Encoding Rules:
- **Bit 0 patterns**:
  - Simple sentence structures
  - Period endings
  - Fewer adverbs
  - Active voice

- **Bit 1 patterns**:
  - Complex sentence structures
  - Exclamation/question endings
  - Adverb insertion
  - Passive voice or complex forms

### Encoding Format:
```
"Please note..." [Original text with sentence structures modified to encode bits]
```

## Usage Notes

- This encoding method is highly resistant to detection as it uses natural language patterns
- Lower capacity than zero-width methods but more resistant to stripping/detection
- Best used in longer text documents with multiple paragraphs
- Complements zero-width encoding for redundancy

## Limitations and Constraints

- Requires sufficient text length (multiple sentences) for reliable encoding
- Encoding capacity depends on number of sentences available
- May slightly alter meaning or tone of original content
- Requires intact sentences for decoding; significant edits may destroy encoded data
- Marker phrase "Please note the following information carefully." is necessary for decoding
- Not suitable for very short texts or highly structured formats