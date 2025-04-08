# Structural Steganography Module

## Module Overview
This module implements high-order linguistic steganography designed to survive multiple rounds of content transformation, including transcoding, paraphrasing, and even translation between languages. Unlike previous approaches focused on character-level or sentence-level features, this module operates on broader narrative structures and rhetorical patterns.

## Design Philosophy
Structural steganography represents the third and most resilient layer in our steganographic encoding system:

1. **Zero-width encoding** (character level) - Invisible but easily stripped
2. **Stylometric encoding** (sentence level) - Resilient to character stripping but affected by paraphrasing
3. **Structural encoding** (narrative level) - Resilient to both character stripping and moderate paraphrasing, with some resistance to translation

The system prioritizes "stickiness" - the ability for encoded metadata to persist through multiple generations of content transformation. This is achieved by encoding information in structural patterns that tend to be preserved even when surface text is modified.

## Core Components

### Content Analysis System
- Detects existing narrative structures and rhetorical patterns
- Analyzes point of view, tense, paragraph structure, and dialectic patterns
- Provides metrics for text transformation decisions

### Multi-level Encoding Framework
- Paragraph structure (alternating paragraph lengths, consistent lengths)
- Point of view transformations (first-person vs. third-person narrative)
- Rhetorical pattern transformations (questions, emphasis, metaphors)
- Tense transformations (past, present, future)
- Dialectic structure transformations (argumentative, descriptive, narrative)

### Extraction System
- Detects marker text for encoded content
- Extracts bits from multiple structural patterns with fallback mechanisms
- Reconstructs original data with error correction capabilities

## Data Flow

1. **Encoding Process**:
   ```
   Input → Content Analysis → Split into Units → Multi-level Encoding → Combine → Output
   ```

2. **Extraction Process**:
   ```
   Input → Detect Marker → Split into Units → Multi-level Pattern Analysis → Extract Bits → Reconstruct Data
   ```

## Technical Details

### Encoding Patterns
The system uses multiple encoding patterns that represent binary bits:

| Pattern Type | Bit 0 | Bit 1 |
|--------------|--------|--------|
| Paragraph Structure | Short-long alternating | Consistent medium-length |
| Point of View | First-person narrative | Third-person narrative |
| Rhetorical Structure | Ending with questions | Ending with emphatic statements |
| Tense | Past tense indicators | Future tense indicators |
| Dialogue | Alternating speakers | Same speaker continuation |

### Encoding Format
The structural encoding adds a marker phrase at the beginning:
```
"The following explores multiple perspectives. [Original text with structural modifications]"
```

### Content Requirements
- Recommended minimum content length: 1000 characters
- Multiple paragraphs (at least 4-5) provide better encoding capacity
- Maximum practical encoding capacity is approximately 64 bits 
- Longer text increases resilience and encoding capacity

## Translation Resistance Mechanisms

The module employs several techniques to ensure data survivability through translation:

1. **Multi-level redundancy**: The same bits are often encoded in multiple structural patterns
2. **Fundamental narrative structures**: Uses patterns that typically survive translation (questions remain questions, emphasis remains emphasis)
3. **Dialectic patterns**: Argumentative, descriptive, and narrative structures tend to be preserved in translation
4. **Paragraph patterns**: Overall text organization patterns typically survive translation

## Usage Notes

- Best used for small metadata payloads (author ID, content ID, timestamp hash)
- More visible than other methods (changes affect human-readable content)
- Strength settings ('subtle', 'moderate', 'aggressive') control the balance between encoding resilience and content preservation
- Provides highest resilience but lowest capacity of all encoding methods

## Integration Points

This module complements the existing steganographic system by adding a third layer of encoding that specifically targets long-term persistence through content transformations:

- Can be used alone for maximum resilience with limited capacity
- Can be combined with other methods for multi-layered encoding
- Provides fallback capabilities when other methods fail

## Example Usage

```typescript
import { hideDataStructurally, extractHiddenStructuralData } from './safety_structural_encoder.genai.mts';

// Encode data structurally
const encodedText = hideDataStructurally(originalContent, JSON.stringify(metadata), {
  minContentLength: 800,
  maxEncodableBits: 48,
  preserveExistingStructure: true,
  encodingStrength: 'moderate'
});

// Extract data 
const extractedData = extractHiddenStructuralData(transformedContent);
if (extractedData) {
  const metadata = JSON.parse(extractedData);
  console.log("Recovered metadata:", metadata);
}
```

## Limitations and Constraints

- Requires substantial text content (multiple paragraphs)
- Lower encoding capacity compared to zero-width methods
- More noticeable changes to content (not invisible like zero-width encoding)
- Extraction reliability depends on the degree of content transformation
- Cannot guarantee perfect extraction after multiple transformation generations
- Text style changes are visible to human readers at higher encoding strengths