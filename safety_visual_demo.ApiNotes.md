# Visual Steganographic Demonstration Module

## Module Overview
This module provides a concrete visualization of the steganographic encoding process, showing how content remains visually unchanged while containing hidden metadata. It demonstrates the encoding/decoding process step-by-step and generates files for human inspection.

## Design Philosophy
The visual demonstration is designed to illustrate the "invisibility" of steganographic encoding while showing its practical application. It serves both as a proof-of-concept and as an educational tool to understand how the system works.

## Core Components

### Visualization Functions
- Transforms invisible characters into visible representations
- Creates before/after comparison of encoded content
- Demonstrates the extraction and verification process

### File Generation
- Creates persistent artifacts for inspection and analysis
- Produces original, encoded, and visualized versions of content
- Generates a manifest with demonstration metrics

## Data Flow

1. **Demonstration Flow**:
   ```
   Generate Sample → Show Original → Apply Encoding → Show "Visually" → Demonstrate Extraction → Verify Integrity
   ```

2. **Visualization Technique**:
   - Replace invisible zero-width characters with visible placeholders:
     - U+200B (ZWSP) → ⟨ZWSP⟩
     - U+200C (ZWNJ) → ⟨ZWNJ⟩
     - U+200D (ZWJ) → ⟨ZWJ⟩

## Output Files

The demonstration generates the following files in the `demo-output` directory:

| Filename | Description |
|----------|-------------|
| 1-original.txt | Original unmodified text content |
| 2-encoded.txt | Text with embedded metadata (looks identical to humans) |
| 3-visualized.txt | Text with zero-width characters made visible |
| demo-manifest.json | Metadata about the demonstration run |

## Usage Notes

- Run this module to demonstrate the steganographic system to non-technical stakeholders
- The visualized output clearly shows the location and extent of hidden data
- Comparison of file sizes reveals the encoding overhead
- The demo also proves signature verification and metadata extraction capabilities

## Running the Demonstration

```javascript
// Import the module
import { demonstrateVisualSteganography } from './safety_visual_demo.genai.mts';

// Run the demonstration
demonstrateVisualSteganography().catch(console.error);
```

## Technical Details

### Visualization Method
The visualization works by substituting each zero-width character with a readable placeholder tag that can be displayed in console output and text editors.

### Demo Metrics
The demonstration captures and reports:
- Original vs encoded content length
- Size of hidden metadata and its overhead
- Extraction success rate
- Signature verification success
- Metadata integrity validation

## Integration Points

This module depends on the multilayer encoding system from `safety_encoder_demo.genai.mts` and demonstrates the complete workflow from content creation through verification.