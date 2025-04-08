# Multilayer Steganographic Encoding Module

## Module Overview
This module integrates multiple steganographic encoding methods (zero-width and stylometric) into a unified system that provides redundant data embedding with cryptographic verification capabilities.

## Design Philosophy
The multilayer approach is designed for resilience - if one encoding method is stripped or detected, the other may still preserve the embedded data. This redundancy is critical for maintaining steganographic integrity in various usage scenarios.

## Core Components

### Key Management System
- Provides key pair generation, storage, and retrieval
- Supports signing and verification operations
- Associates identities with cryptographic key pairs

### Multilayer Encoding Process
- Combines zero-width and stylometric encoding methods
- Applies encoding methods sequentially for maximum compatibility
- Signs the final result for authentication

### Verification and Extraction
- Verifies cryptographic signatures against known keys
- Attempts extraction using multiple methods (fallback strategy)
- Performs metadata integrity validation

## Data Flow

1. **Encoding Flow**:
   ```
   Original Content → Zero-Width Encoding → Stylometric Encoding → Signature → Distribution Package
   ```

2. **Decoding Flow**:
   ```
   Verify Signature → Try Stylometric Extraction → Try Zero-Width Extraction → Parse Metadata
   ```

3. **Extraction Fallback Strategy**:
   - Try primary method (stylometric)
   - If failed, fall back to secondary method (zero-width)
   - Return first valid result or null if all methods fail

## Technical Details

### Integration Method:
The integration applies encodings sequentially:
1. First layer: Zero-width character encoding (invisible characters)
2. Second layer: Stylometric encoding (linguistic patterns)

This nested approach ensures each method can operate independently, while maximizing the chance of successful extraction.

### Package Structure:
```typescript
{
  content: string,   // Text with embedded metadata (both methods)
  signature: string  // Base64-encoded cryptographic signature
}
```

## Usage Notes

- Use this module when maximum resilience is required
- Provide sufficiently long text for both encoding methods to work effectively
- Metadata should be kept reasonably small to minimize encoding overhead
- Always verify signature before trusting extracted metadata

## Running the Demo

```javascript
// Import the module
import { runMultilayerDemo } from './safety_encoder_demo.genai.mts';

// Run the demonstration
runMultilayerDemo();
```

## Example Output:

```
MULTILAYER STEGANOGRAPHIC DEMO
==============================

Original content length: 357
Metadata to hide: { creator: 'alice', timestamp: '2023-...', ... }

Encoded content length: 589
Signature: AbCd1234...

DECODING CONTENT
================

Extracted metadata using stylometric method
Verified signer: alice
Extracted metadata: { creator: 'alice', timestamp: '2023-...', ... }

Metadata integrity check:
✓ All metadata values match the original data
```