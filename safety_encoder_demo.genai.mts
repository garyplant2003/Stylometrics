/**
 * Steganographic Encoding Demo
 * 
 * This module demonstrates the combined use of zero-width and stylometric 
 * steganography techniques to provide redundant encoding with high detection
 * resistance.
 * 
 * Flow: Original Content → Encode with Method 1 → Encode with Method 2 → Sign → Distribute
 */

import crypto from 'crypto';
import { hideDataInText, extractHiddenData } from './safety_embedded_word.genai.mts';
import { hideDataStylometrically, extractHiddenStylometricData } from './safety_stylometric_encoder.genai.mts';

/**
 * Represents a cryptographic key pair with identifier
 */
interface KeyPair {
  publicKey: string;
  privateKey: string;
  keyId: string;
}

/**
 * Manages cryptographic keys for multiple identities
 */
export class KeyManager {
  private keyPairs: Map<string, KeyPair> = new Map();
  
  /**
   * Generate a new key pair for an identity
   * @param name Identity name
   * @returns Key pair object
   */
  generateNewKeyPair(name: string): KeyPair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 512,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    
    const keyId = crypto.createHash('sha256').update(publicKey).digest('hex').substring(0, 8);
    const keyPair = { publicKey, privateKey, keyId };
    this.keyPairs.set(name, keyPair);
    return keyPair;
  }
  
  /**
   * Get a key pair by identity name
   * @param name Identity name
   * @returns Key pair or undefined if not found
   */
  getKeyPair(name: string): KeyPair | undefined {
    return this.keyPairs.get(name);
  }
  
  /**
   * Sign content with a specific identity's key
   * @param name Identity name 
   * @param content Content to sign
   * @returns Base64 signature or null if key not found
   */
  signWithKey(name: string, content: string): string | null {
    const keyPair = this.keyPairs.get(name);
    if (!keyPair) return null;
    
    const signer = crypto.createSign('SHA256');
    signer.update(content);
    return signer.sign(keyPair.privateKey, 'base64');
  }
  
  /**
   * Verify content against all known keys
   * @param content Content to verify
   * @param signature Signature to check
   * @returns Identity name that signed the content, or null if not verified
   */
  verifySignature(content: string, signature: string): string | null {
    for (const [name, keyPair] of this.keyPairs.entries()) {
      const verifier = crypto.createVerify('SHA256');
      verifier.update(content);
      if (verifier.verify(keyPair.publicKey, signature, 'base64')) {
        return name;
      }
    }
    return null;
  }
}

/**
 * Result of encoded content package
 */
interface EncodedPackage {
  content: string;
  signature: string;
}

/**
 * Result of decoded content
 */
interface DecodedResult {
  metadata: any;
  signerName: string | null;
}

/**
 * Encode content with multiple layers of steganography
 * @param originalContent Original text content
 * @param metadata Metadata to embed
 * @param keyManager Key manager for signing
 * @param signerName Identity to sign with
 * @returns Encoded package or null if encoding fails
 */
export const encodeMultilayerContent = (
  originalContent: string,
  metadata: any,
  keyManager: KeyManager,
  signerName: string
): EncodedPackage | null => {
  try {
    // Convert metadata to JSON string
    const metadataStr = JSON.stringify(metadata);
    
    // Layer 1: Hide metadata using zero-width characters
    const contentWithZeroWidth = hideDataInText(originalContent, metadataStr);
    
    // Layer 2: Apply stylometric encoding with the same metadata
    // This provides redundancy in case one encoding is stripped
    const contentWithBothEncodings = hideDataStylometrically(contentWithZeroWidth, metadataStr);
    
    // Sign the final content
    const signature = keyManager.signWithKey(signerName, contentWithBothEncodings);
    if (!signature) {
      console.error(`Failed to sign content: key for ${signerName} not found`);
      return null;
    }
    
    return {
      content: contentWithBothEncodings,
      signature
    };
  } catch (error) {
    console.error("Error encoding content:", error);
    return null;
  }
};

/**
 * Decode and verify content with multiple steganographic layers
 * @param encodedContent Content to decode
 * @param signature Signature to verify
 * @param keyManager Key manager for verification
 * @returns Decoded result or null if decoding fails
 */
export const decodeMultilayerContent = (
  encodedContent: string,
  signature: string,
  keyManager: KeyManager
): DecodedResult | null => {
  try {
    // Verify signature first
    const signerName = keyManager.verifySignature(encodedContent, signature);
    if (!signerName) {
      console.error("Could not verify content signature with any known key");
      return { metadata: null, signerName: null };
    }
    
    // Try both extraction methods
    let extractedMetadata = null;
    
    // Try stylometric extraction first
    const stylometricData = extractHiddenStylometricData(encodedContent);
    if (stylometricData) {
      try {
        extractedMetadata = JSON.parse(stylometricData);
        console.log("Extracted metadata using stylometric method");
      } catch (e) {
        console.log("Stylometric data was not valid JSON");
      }
    }
    
    // If stylometric failed, try zero-width extraction
    if (!extractedMetadata) {
      const zeroWidthData = extractHiddenData(encodedContent);
      if (zeroWidthData) {
        try {
          extractedMetadata = JSON.parse(zeroWidthData);
          console.log("Extracted metadata using zero-width method");
        } catch (e) {
          console.log("Zero-width data was not valid JSON");
        }
      }
    }
    
    if (!extractedMetadata) {
      console.error("Could not extract metadata using any method");
      return { metadata: null, signerName };
    }
    
    return {
      metadata: extractedMetadata,
      signerName
    };
  } catch (error) {
    console.error("Error decoding content:", error);
    return null;
  }
};

/**
 * Demo function to show multilayer encoding and decoding
 */
export const runMultilayerDemo = (): void => {
  console.log("MULTILAYER STEGANOGRAPHIC DEMO");
  console.log("==============================\n");
  
  // Setup key manager and identities
  const keyManager = new KeyManager();
  keyManager.generateNewKeyPair("alice");
  keyManager.generateNewKeyPair("bob");
  
  // Original content
  const originalContent = `
This is an example of a document that contains important information.
It spans multiple paragraphs to demonstrate how the stylometric encoding works.

The information in this document appears normal to human readers while containing
hidden metadata that can be extracted programmatically.

This approach provides plausible deniability while enabling content tracking and
verification through cryptographic signatures.
  `;
  
  // Metadata to embed
  const metadata = {
    creator: "alice",
    timestamp: new Date().toISOString(),
    contentId: crypto.randomBytes(4).toString('hex'),
    classification: "demonstration",
    version: "1.0"
  };
  
  console.log("Original content length:", originalContent.length);
  console.log("Metadata to hide:", metadata);
  
  // Encode content
  const encodedPackage = encodeMultilayerContent(originalContent, metadata, keyManager, "alice");
  if (!encodedPackage) {
    console.error("Failed to encode content");
    return;
  }
  
  console.log("\nEncoded content length:", encodedPackage.content.length);
  console.log("Signature:", encodedPackage.signature);
  
  // Decode and verify
  console.log("\nDECODING CONTENT");
  console.log("================\n");
  
  const decodedResult = decodeMultilayerContent(encodedPackage.content, encodedPackage.signature, keyManager);
  if (!decodedResult) {
    console.error("Failed to decode content");
    return;
  }
  
  console.log("Verified signer:", decodedResult.signerName);
  console.log("Extracted metadata:", decodedResult.metadata);
  
  // Validate metadata integrity
  console.log("\nMetadata integrity check:");
  if (decodedResult.metadata) {
    let matches = true;
    for (const [key, value] of Object.entries(metadata)) {
      if (decodedResult.metadata[key] !== value) {
        matches = false;
        console.log(`- ${key}: MISMATCH (expected ${value}, got ${decodedResult.metadata[key]})`);
      }
    }
    if (matches) {
      console.log("✓ All metadata values match the original data");
    }
  }
};

// Auto-run the demonstration if this file is executed directly
if (require.main === module) {
  runMultilayerDemo();
}