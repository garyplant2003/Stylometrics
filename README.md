# Stylometrics
Stylometric Stenography LLM Generation Attribution DRM/DLP
# Steganographic Encoding API Notes

## Modules

### Zero-Width Character Steganography (`system.safety_canary_word.genai.mts`)
Primary encoding system using invisible Unicode characters to hide data. This method 
is effective but can be detected programmatically by checking for specific Unicode 
character sequences.

### Stylometric Steganography (`system.safety_stylometric_encoder.genai.mts`)
Secondary encoding system using natural language patterns to hide data. Creates plausible
deniability through linguistic transformations that appear as normal stylistic variations
rather than encoded data.

### Multilayer Steganography (`system.safety_encoder_demo.genai.mts`)
Integration module that combines both steganographic methods to provide redundant
encoding with high detection resistance and signature verification.

### Visual Demonstration (`system.safety_visual_demo.genai.mts`)
Provides concrete visualization and explanation of the steganographic encoding process,
showing the before/after effects and metadata extraction capabilities.

## Design Goals

1. **Plausible Deniability**: All encoding systems aim to hide data while maintaining
   the appearance of regular content.
   
2. **Redundant Encoding**: Multiple encoding methods can be used independently
   or in tandem for increased security.
   
3. **Detection Resistance**: The stylometric approach is specifically designed to evade
   detection methods that search for invisible/special characters.
   
4. **Verifiable Authenticity**: Cryptographic signatures ensure content hasn't been tampered with.

## Integration Points

- All encoding systems can be used with the cryptographic signature infrastructure 
  for content authentication.
  
- The visual demonstration shows how the techniques operate in practice and provides
  a reference implementation for testing.

## Visualization Notes

When demonstrating the encoding techniques, keep in mind:

1. Zero-width characters are invisible in normal text display but can be revealed
   through specialized tools or by using character substitution.
   
2. Stylometric encoding produces changes that appear as normal writing style variations
   rather than obvious encoding patterns.
   
3. The combination of both methods provides redundancy and increased security against
   various types of detection or cleaning operations.

## Demonstration Example

### Original Text
--------------------------------------------------
# Project Status Report - April 2025

## Executive Summary
The A-Finite-Monkey-Engine project has made substantial progress in the first quarter. 
We've completed the core steganographic implementation and verification system, allowing
for reliable content tracking with cryptographic signatures.

[...rest of original text...]
--------------------------------------------------

### Metadata to Embed
```json
{
  "creator": "alice",
  "keyId": "a1b2c3d4",
  "timestamp": "2025-04-08T15:30:45.123Z",
  "documentId": "fe7a9c2b",
  "classification": "internal",
  "version": "1.2.0",
  "department": "Engineering"
}
```

### Encoded Text (As It Appears to Humans)
--------------------------------------------------
# Project Status Report - April 2025

## Executive Summary
The A-Finite-Monkey-Engine project has made substantial progress in the first quarter. 
We've completed the core steganographic implementation and verification system, allowing
for reliable content tracking with cryptographic signatures.

[...looks identical to original...]
--------------------------------------------------

### Encoded Text (With Zero-Width Characters Visualized)
--------------------------------------------------
# Project Status Report - April 2025

## Executive Summary
The A-Finite-⟨ZWJ⟩⟨ZWJ⟩⟨ZWJ⟩⟨ZWSP⟩⟨ZWSP⟩⟨ZWSP⟩⟨ZWSP⟩⟨ZWSP⟩⟨ZWSP⟩⟨ZWSP⟩⟨ZWSP⟩[...many visualization symbols...]⟨ZWJ⟩⟨ZWJ⟩⟨ZWJ⟩Monkey-Engine project has made substantial progress in the first quarter. 
[...rest with visualization of hidden data...]
--------------------------------------------------

### Verification and Extraction Process
--------------------------------------------------
Signature verification: ✓ VALID
Signed by: alice

Extracted Metadata:
```json
{
  "creator": "alice",
  "keyId": "a1b2c3d4",
  "timestamp": "2025-04-08T15:30:45.123Z",
  "documentId": "fe7a9c2b",
  "classification": "internal",
  "version": "1.2.0",
  "department": "Engineering"
}
```

Metadata Integrity Check:
✓ All metadata values match the original data
- creator: ✓ (alice)
- keyId: ✓ (a1b2c3d4)
- timestamp: ✓ (2025-04-08T15:30:45.123Z)
- documentId: ✓ (fe7a9c2b)
- classification: ✓ (internal)
- version: ✓ (1.2.0)
- department: ✓ (Engineering)
--------------------------------------------------

### Demonstration Summary
--------------------------------------------------
1. Original content length: 632 characters
2. Encoded content length: 957 characters
3. Difference: 325 characters (hidden data)
4. Metadata JSON size: 167 characters
5. Signature length: 88 characters

Output files have been saved to: /home/files/git/a-finite-monkey-engine/integrations/genaisrc/demo-output
- 1-original.txt: The original unmodified text
- 2-encoded.txt: Text with embedded metadata (appears visually identical)
- 3-visualized.txt: Encoded text with zero-width characters made visible
--------------------------------------------------

## Key Points About the Demonstration
1. Visual Identity: To human readers, the original and encoded text appear identical, but the encoded version contains hidden metadata.

2. Visualization: The demo uses special markers to show where zero-width characters are inserted, making the otherwise invisible encoding visible.

3. Redundant Encoding: Both zero-width characters and stylometric patterns encode the same metadata for resilience.

4. Cryptographic Verification: The signature allows verification of authenticity and identification of the creator.

5. File Exports: The demo creates files showing the original text, encoded text, and visualization to help understand what's happening.

This demonstration provides both a technical explanation of how the steganographic encoding works and a practical example of the before/after effects, showing how metadata can be hidden within text while maintaining its visual appearance.

## Running GenAIScript Modules

This project contains several GenAIScript modules that demonstrate different steganographic encoding techniques. Here's how to run them using the Node.js API or within VS Code.

### Using the Node.js API

To run these scripts programmatically, install the GenAIScript package and use its API:

```bash
npm install --save-dev genaiscript
```

Create a runner script (e.g., `run-demo.js`) and execute specific modules:

```javascript
import { run } from 'genaiscript/api';

// Choose which demonstration to run
async function main() {
  // Run the visual demonstration with file output
  const visualDemo = await run('safety_visual_demo.genai.mts', []);
  console.log('Visual demo completed, files saved to demo-output/');
  
  // Run the zero-width character encoding demo
  const zeroWidthDemo = await run('safety_embedded_word.genai.mts', []);
  console.log('Zero-width character demo completed');
  
  // Run the multilayer encoding demo
  const multilayerDemo = await run('safety_encoder_demo.genai.mts', []);
  console.log('Multilayer encoding demo completed');
  
  // Run the stylometric encoding demo (requires custom parameters)
  const stylometricDemo = await run('safety_stylometric_encoder.genai.mts', [
    '--text', 'Your sample text goes here',
    '--data', 'Hidden data to encode'
  ]);
  console.log('Stylometric demo completed');
}

main().catch(console.error);
```

### Running in VS Code

For seamless integration with VS Code:

1. Install the GenAIScript extension for VS Code
2. Open any of the `.genai.mts` files in the project
3. Use one of these methods to run the script:
   - Use the Command Palette (Ctrl+Shift+P) and search for "Run GenAIScript"
   - Right-click in the editor and select "Run GenAIScript"
   - Click the "Run" button that appears above the main function

### Available Demonstrations

Each module demonstrates a different aspect of steganographic encoding:

| Module File | Description | Output |
|-------------|-------------|--------|
| `safety_visual_demo.genai.mts` | Graphical demonstration that creates files showing the encoding process | Files in `demo-output/` directory |
| `safety_embedded_word.genai.mts` | Zero-width character steganography demo | Console output |
| `safety_encoder_demo.genai.mts` | Combined multilayer steganographic encoding | Console output |
| `safety_stylometric_encoder.genai.mts` | Linguistic pattern-based encoding | Console output |

### Example: Creating a Custom Test

```javascript
import { run } from 'genaiscript/api';
import fs from 'fs';

async function customTest() {
  // Get sample text from a file
  const sampleText = fs.readFileSync('sample.txt', 'utf8');
  
  // Run the encoding with custom parameters
  const result = await run('safety_encoder_demo.genai.mts', [
    '--text', sampleText,
    '--metadata', JSON.stringify({
      creator: "user123",
      timestamp: new Date().toISOString(),
      documentId: "custom-test-001"
    })
  ]);
  
  console.log('Encoding result:', result);
}

customTest().catch(console.error);
```

### Additional Resources

- Refer to each module's ApiNotes.md file for detailed documentation on functionality and usage
- The project-level ApiNotes.md provides a comprehensive overview of the entire system
- Each demonstration includes console output explaining the encoding/decoding process