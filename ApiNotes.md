# Stylometrics Project API Notes

## Project Overview

This project implements a multi-layered steganographic encoding system for content tracking and attribution. The system embeds metadata within text content using three complementary encoding methods operating at different linguistic levels, all while maintaining plausible deniability and resilience against various types of content transformation.

## Architecture

The system employs a layered architecture with the following components:

1. **Core Encoding Methods**
   - Zero-width character steganography (`safety_embedded_word.genai.mts`) - Character level
   - Stylometric steganography (`safety_stylometric_encoder.genai.mts`) - Sentence level
   - Structural steganography (`safety_structural_encoder.genai.mts`) - Narrative/document level

2. **Integration Layer**
   - Multilayer encoding/decoding (`safety_encoder_demo.genai.mts`)

3. **Visualization & Demonstration**
   - Visual representation of encoding (`safety_visual_demo.genai.mts`)

## Design Goals & Constraints

1. **Plausible Deniability**: All encoding should be invisible or natural-looking to human readers
2. **Detection Resistance**: Multiple encoding methods provide redundancy in case one is stripped
3. **Transformation Resilience**: Higher-order encoding survives transcoding, paraphrasing, and translation
4. **Verification**: Cryptographic signatures ensure content authenticity
5. **Metadata Preservation**: System can embed and extract structured metadata reliably
6. **Error Handling**: Graceful fallback when content is modified or corrupt
7. **Cross-Generation Persistence**: Ability for metadata to survive through multiple content transformations

## Encoding Layers

### Layer 1: Zero-Width Character Encoding
- Invisible Unicode characters embedded within text
- High capacity, completely invisible to readers
- Vulnerable to character stripping or transcoding
- Implementation: `safety_embedded_word.genai.mts`

### Layer 2: Stylometric Encoding
- Sentence structure and punctuation patterns
- Medium capacity, appears as natural writing style variation
- Survives character stripping but vulnerable to paraphrasing
- Implementation: `safety_stylometric_encoder.genai.mts`

### Layer 3: Structural Encoding
- Document-level patterns across paragraphs, narrative, and rhetorical structures
- Low capacity but highest resilience to transformation
- Can survive paraphrasing and moderate translation
- Implementation: `safety_structural_encoder.genai.mts`

## Data Flow

```
┌─────────────┐     ┌───────────────┐     ┌──────────────┐     ┌───────────────┐     ┌───────────────┐
│             │     │ Zero-Width    │     │ Stylometric  │     │ Structural    │     │               │
│ Input Text  ├────►│ Encoding      ├────►│ Encoding     ├────►│ Encoding      ├────►│ Cryptographic │
│ + Metadata  │     │ (Layer 1)     │     │ (Layer 2)    │     │ (Layer 3)     │     │ Signature     │
└─────────────┘     └───────────────┘     └──────────────┘     └───────────────┘     └───────┬───────┘
                                                                                            │
                                                                                            ▼
┌─────────────┐     ┌───────────────┐     ┌──────────────┐     ┌───────────────┐     ┌───────────────┐
│ Extracted   │     │ Structural    │     │ Stylometric  │     │ Zero-Width    │     │ Signature     │
│ Metadata    │◄────┤ Decoding      │◄────┤ Decoding     │◄────┤ Decoding      │◄────┤ Verification  │
│             │     │ (redundant)   │     │ (redundant)  │     │ (redundant)   │     │               │
└─────────────┘     └───────────────┘     └──────────────┘     └───────────────┘     └───────────────┘
```

## Key Management

- RSA key pairs (public/private) for content signing and verification
- Key IDs derived from public key hashes
- Multiple identities supported through named key pairs

## Transformation Resilience

The system is designed to handle various transformation scenarios:

1. **Character stripping**: If zero-width characters are removed, stylometric and structural encoding provide fallback
2. **Reformatting/whitespace changes**: Zero-width characters operate independently of formatting
3. **Paraphrasing**: Structural encoding maintains most patterns even when specific words change
4. **Machine translation**: Core rhetorical structures and paragraph patterns often survive translation
5. **Multi-generation copying**: At least one layer typically survives through multiple transformations
6. **Content shortening**: Strategic positioning of encodings increases chance of survival

## Usage Patterns

1. **Content Creation & Signing**:
   - Generate metadata (creator, timestamp, ID, etc.)
   - Embed metadata using multilayer encoding
   - Sign with creator's private key
   - Distribute content

2. **Content Verification**:
   - Verify signature against known public keys
   - Extract metadata using available decoding methods
   - Validate extracted metadata integrity

3. **Cross-Generation Tracking**:
   - Track content as it evolves through multiple transformations
   - Use fallback methods to recover metadata when certain encodings are stripped
   - Rely on structural encoding for maximum persistence

## Running the Scripts

### Using the GenAIScript Node.js API

```javascript
import { run } from 'genaiscript/api';

// Run specific demonstration
await run('safety_visual_demo.genai', []); // Visual encoding demonstration
await run('safety_embedded_word.genai', []); // Zero-width encoding demo
await run('safety_encoder_demo.genai', []); // Multilayer encoding demo
await run('safety_structural_encoder.genai', []); // Structural encoding demo
```

### Running in VS Code

For direct execution within VS Code:

1. Install the GenAIScript extension
2. Open a .genai.mts file
3. Use the "Run GenAIScript" command from the Command Palette
4. View results in the integrated console

## Technical Notes

- Zero-width characters used: ZWSP (U+200B), ZWNJ (U+200C), ZWJ (U+200D)
- Stylometric encoding uses sentence structure and punctuation patterns
- Structural encoding uses narrative structure, point of view, and rhetorical patterns
- Metadata is serialized as JSON before encoding
- Signature algorithm: SHA-256 with RSA

## Resilience Matrix

| Transformation Type | Zero-Width | Stylometric | Structural |
|--------------------|------------|-------------|------------|
| Character stripping | ❌ Fails   | ✅ Survives | ✅ Survives |
| Whitespace changes  | ✅ Survives | ✅ Survives | ✅ Survives |
| Minor rewording     | ✅ Survives | ⚠️ Partial  | ✅ Survives |
| Major paraphrasing  | ❌ Fails   | ❌ Fails    | ⚠️ Partial  |
| Machine translation | ❌ Fails   | ❌ Fails    | ⚠️ Partial  |
| Format conversion   | ⚠️ Partial | ✅ Survives | ✅ Survives |
| Content shortening  | ⚠️ Partial | ⚠️ Partial  | ⚠️ Partial  |

## Implementation Status

- Zero-width encoding: Complete
- Stylometric encoding: Complete
- Structural encoding: Complete
- Multilayer integration: Zero-width and stylometric integrated; structural pending
- Visual demonstration: Zero-width visualization only