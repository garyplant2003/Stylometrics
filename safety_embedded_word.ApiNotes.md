# Zero-Width Character Steganography Module

## Module Overview
This module implements steganographic encoding using zero-width Unicode characters to hide metadata within text content while maintaining visual appearance. It also provides cryptographic signature capabilities for content authentication.

## Core Components

### Key Management System
- Manages cryptographic key pairs for multiple identities
- Provides key generation, storage, and retrieval functions
- Maps identity names to key pairs for signing and verification

### Steganographic Encoding
- Uses invisible Unicode characters (ZWSP, ZWNJ, ZWJ) to encode binary data
- Preserves visual appearance of text while embedding hidden metadata
- Includes markers and length headers for reliable extraction

## Data Flow

1. **Encoding Process**:
   - Convert metadata string to binary representation
   - Create start marker using ZWJ characters
   - Encode data length as 16-bit binary using ZWSP/ZWNJ
   - Encode actual data bits using ZWSP/ZWNJ
   - Add end marker using ZWJ characters
   - Insert at a pseudorandom but consistent position in text

2. **Extraction Process**:
   - Find start/end markers in text
   - Extract binary data between markers
   - Parse length header to determine data size
   - Convert binary back to character data
   - Return extracted string or null if no data found

3. **Signature Process**:
   - Generate signature of content using private key
   - Verify signature using public key
   - Match signature to known identity

## Technical Details

### Zero-Width Characters:
- ZWSP (U+200B): Zero-width space - represents binary 0
- ZWNJ (U+200C): Zero-width non-joiner - represents binary 1
- ZWJ (U+200D): Zero-width joiner - used for markers

### Encoding Format:
```
[Text before] [ZWJ×3] [16-bit length as ZWSP/ZWNJ] [Data as ZWSP/ZWNJ] [ZWJ×3] [Text after]
```

### Cryptography:
- RSA key pairs with 512-bit modulus (demonstration only)
- SHA-256 hash algorithm for signatures
- Key IDs derived from SHA-256 hash of public key (first 8 chars)

## Usage Notes

- This encoding method is invisible to human readers but can be detected programmatically
- Best used in combination with stylometric encoding for redundancy
- Position of hidden data is determined algorithmically for consistency
- The system allows verification of content source without revealing the encoding mechanism

## Limitations and Constraints

- Zero-width characters can be stripped by text processors or sanitizers
- Encoding overhead: Each byte of metadata requires 8 zero-width characters
- Requires sufficient text length to accommodate hidden data plus markers
- Detection is possible by scanning for sequences of zero-width characters