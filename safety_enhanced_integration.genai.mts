/**
 * Enhanced Multilayer Steganographic Integration
 * 
 * This module integrates all three steganographic encoding methods (zero-width, 
 * stylometric, and structural) to provide maximum resilience against multiple
 * generations of content transformation, including transcoding, paraphrasing,
 * and even translation between languages.
 * 
 * Flow: 
 * Content → Zero-Width → Stylometric → Structural → Signature → Distribution
 */

import crypto from 'crypto';
import { hideDataInText, extractHiddenData } from './safety_embedded_word.genai.mts';
import { hideDataStylometrically, extractHiddenStylometricData } from './safety_stylometric_encoder.genai.mts';
import { hideDataStructurally, extractHiddenStructuralData } from './safety_structural_encoder.genai.mts';
import { KeyManager } from './safety_encoder_demo.genai.mts';

/**
 * Options for the enhanced multilayer encoding process
 */
export interface EnhancedEncodingOptions {
  // Enable/disable specific encoding layers
  useZeroWidth: boolean;
  useStylometric: boolean;
  useStructural: boolean;
  
  // Structural encoding options
  structuralStrength: 'subtle' | 'moderate' | 'aggressive';
  
  // Advanced options
  redundantEncoding: boolean; // Whether to encode same data in all layers
}

/**
 * Default encoding options
 */
const DEFAULT_OPTIONS: EnhancedEncodingOptions = {
  useZeroWidth: true,
  useStylometric: true,
  useStructural: true,
  structuralStrength: 'moderate',
  redundantEncoding: true
};

/**
 * Result of enhanced encoded content package
 */
export interface EnhancedPackage {
  content: string;
  signature: string;
  encodingInfo: {
    layers: string[];
    originalLength: number;
    finalLength: number;
  };
}

/**
 * Result of decoded content with enhanced extraction
 */
export interface EnhancedDecodedResult {
  metadata: any;
  signerName: string | null;
  extractionSource: string; // Which layer successfully extracted the data
  integrity: boolean; // Whether extracted data matches across available layers
}

/**
 * Encodes content with multiple layers of steganography for maximum resilience
 * @param originalContent Original text content
 * @param metadata Metadata to embed
 * @param keyManager Key manager for signing
 * @param signerName Identity to sign with
 * @param options Encoding configuration options
 * @returns Enhanced encoded package or null if encoding fails
 */
export const encodeEnhancedContent = (
  originalContent: string,
  metadata: any,
  keyManager: KeyManager,
  signerName: string,
  options: EnhancedEncodingOptions = DEFAULT_OPTIONS
): EnhancedPackage | null => {
  try {
    // Convert metadata to JSON string
    const metadataStr = JSON.stringify(metadata);
    
    let processedContent = originalContent;
    const enabledLayers: string[] = [];
    
    // Layer 1: Zero-width character encoding (if enabled)
    if (options.useZeroWidth) {
      processedContent = hideDataInText(processedContent, metadataStr);
      enabledLayers.push('zero-width');
    }
    
    // Layer 2: Stylometric encoding (if enabled)
    if (options.useStylometric) {
      // For non-redundant encoding, use a subset of metadata when multiple layers are enabled
      const stylometricData = options.redundantEncoding ? 
        metadataStr : 
        JSON.stringify({ subset: "stylometric", id: metadata.id || metadata.creator });
      
      processedContent = hideDataStylometrically(processedContent, stylometricData);
      enabledLayers.push('stylometric');
    }
    
    // Layer 3: Structural encoding (if enabled)
    if (options.useStructural && processedContent.length >= 800) {
      // For non-redundant encoding, use a subset of metadata
      const structuralData = options.redundantEncoding ? 
        metadataStr : 
        JSON.stringify({ subset: "structural", id: metadata.id || metadata.creator });
      
      // Apply structural encoding with specified strength
      processedContent = hideDataStructurally(processedContent, structuralData, {
        minContentLength: 800,
        maxEncodableBits: 64,
        preserveExistingStructure: true,
        encodingStrength: options.structuralStrength
      });
      enabledLayers.push('structural');
    }
    
    // Sign the final content
    const signature = keyManager.signWithKey(signerName, processedContent);
    if (!signature) {
      console.error(`Failed to sign content: key for ${signerName} not found`);
      return null;
    }
    
    return {
      content: processedContent,
      signature,
      encodingInfo: {
        layers: enabledLayers,
        originalLength: originalContent.length,
        finalLength: processedContent.length
      }
    };
  } catch (error) {
    console.error("Error encoding enhanced content:", error);
    return null;
  }
};

/**
 * Extracts metadata from content that may have been encoded with multiple steganographic methods
 * Uses a prioritized extraction strategy with fallbacks
 * @param encodedContent Content to analyze for hidden data
 * @param signature Signature to verify
 * @param keyManager Key manager for verification
 * @returns Enhanced decoded result or null if decoding fails
 */
export const decodeEnhancedContent = (
  encodedContent: string,
  signature: string,
  keyManager: KeyManager
): EnhancedDecodedResult | null => {
  try {
    // Verify signature first
    const signerName = keyManager.verifySignature(encodedContent, signature);
    if (!signerName) {
      console.error("Could not verify content signature with any known key");
      return { metadata: null, signerName: null, extractionSource: 'none', integrity: false };
    }
    
    // Array to store extracted data from each method
    const extractionResults: {source: string; data: any}[] = [];
    
    // Try extraction from structural encoding (most resilient to transformation)
    const structuralData = extractHiddenStructuralData(encodedContent);
    if (structuralData) {
      try {
        const parsedData = JSON.parse(structuralData);
        console.log("✓ Extracted metadata using structural method");
        extractionResults.push({source: 'structural', data: parsedData});
      } catch (e) {
        console.log("⚠ Structural data was not valid JSON");
      }
    }
    
    // Try extraction from stylometric encoding (medium resilience)
    const stylometricData = extractHiddenStylometricData(encodedContent);
    if (stylometricData) {
      try {
        const parsedData = JSON.parse(stylometricData);
        console.log("✓ Extracted metadata using stylometric method");
        extractionResults.push({source: 'stylometric', data: parsedData});
      } catch (e) {
        console.log("⚠ Stylometric data was not valid JSON");
      }
    }
    
    // Try extraction from zero-width encoding (least resilient to transformation)
    const zeroWidthData = extractHiddenData(encodedContent);
    if (zeroWidthData) {
      try {
        const parsedData = JSON.parse(zeroWidthData);
        console.log("✓ Extracted metadata using zero-width method");
        extractionResults.push({source: 'zero-width', data: parsedData});
      } catch (e) {
        console.log("⚠ Zero-width data was not valid JSON");
      }
    }
    
    // If no data extracted from any method
    if (extractionResults.length === 0) {
      console.error("Could not extract metadata using any method");
      return { metadata: null, signerName, extractionSource: 'none', integrity: false };
    }
    
    // Use the most resilient method's data that succeeded
    const primaryExtraction = extractionResults[0];
    
    // Check integrity across methods if we have multiple extraction results
    let integrity = true;
    if (extractionResults.length > 1) {
      // For redundant encoding (same data in all layers), check if all extracted data matches
      const baselineMeta = JSON.stringify(primaryExtraction.data);
      
      for (let i = 1; i < extractionResults.length; i++) {
        // Handle both fully redundant encoding and partial encoding cases
        const currentResult = extractionResults[i].data;
        
        if (currentResult.subset) {
          // This is partial data, so only check the id field
          if (primaryExtraction.data.id && currentResult.id !== primaryExtraction.data.id) {
            integrity = false;
            console.warn(`⚠ Integrity mismatch: ${extractionResults[i].source} has different id`);
          }
        } else {
          // This should be identical data
          if (JSON.stringify(currentResult) !== baselineMeta) {
            integrity = false;
            console.warn(`⚠ Integrity mismatch: ${extractionResults[i].source} has different data`);
          }
        }
      }
      
      console.log(`${integrity ? '✓' : '⚠'} Cross-layer integrity check: ${integrity ? 'PASSED' : 'FAILED'}`);
    }
    
    return {
      metadata: primaryExtraction.data,
      signerName,
      extractionSource: primaryExtraction.source,
      integrity
    };
  } catch (error) {
    console.error("Error decoding enhanced content:", error);
    return null;
  }
};

/**
 * Demonstrates the enhanced multilayer encoding and decoding process
 */
export const runEnhancedDemo = async (): Promise<void> => {
  console.log("ENHANCED MULTILAYER STEGANOGRAPHIC DEMO");
  console.log("=======================================\n");
  
  // Setup key manager and identities
  const keyManager = new KeyManager();
  const alice = keyManager.generateNewKeyPair("alice");
  console.log(`Generated key pair for Alice (keyId: ${alice.keyId})`);
  
  // Original content - must be substantial for structural encoding
  const originalContent = `
The development of advanced encoding systems represents a significant step forward
in the field of information security and content attribution. These systems must be
resilient against various forms of transformation while maintaining the integrity
of embedded metadata.

When developing such systems, we must consider multiple layers of encoding that
operate at different levels of the content structure. Each layer provides its own
unique advantages and resilience characteristics, creating a complementary approach
to metadata persistence.

The first approach operates at the character level, embedding invisible markers
within the text itself. While efficient and high-capacity, these markers may be
vulnerable to certain types of content processing or transcoding operations.

The second approach focuses on sentence structures and linguistic patterns that
appear as natural stylistic choices to human readers. This method survives certain
transformations that would destroy character-level encodings, providing an important
fallback mechanism.

Perhaps most interesting is the third approach, which encodes information in the
broader narrative structures, rhetorical patterns, and document organization. These
high-level patterns often survive even major content transformations, including
paraphrasing and translation between languages.

By combining these complementary approaches, we can create content attribution
systems that maintain their effectiveness across multiple generations of content
transformation, ensuring that proper credit and tracking remains intact throughout
the content lifecycle.
  `;
  
  // Metadata to embed
  const metadata = {
    creator: "alice",
    keyId: alice.keyId,
    timestamp: new Date().toISOString(),
    documentId: crypto.randomBytes(4).toString('hex'),
    version: "1.0",
    classification: "demonstration"
  };
  
  console.log("Original content length:", originalContent.length, "characters");
  console.log("Metadata to embed:", metadata);
  
  // Test different encoding configurations
  
  console.log("\n=== TESTING FULL MULTILAYER ENCODING ===");
  const fullEncoding = encodeEnhancedContent(
    originalContent, 
    metadata, 
    keyManager, 
    "alice",
    {
      useZeroWidth: true,
      useStylometric: true,
      useStructural: true,
      structuralStrength: 'moderate',
      redundantEncoding: true
    }
  );
  
  if (!fullEncoding) {
    console.error("Failed to apply full encoding");
    return;
  }
  
  console.log("Encoded with layers:", fullEncoding.encodingInfo.layers.join(", "));
  console.log("Original length:", fullEncoding.encodingInfo.originalLength, "characters");
  console.log("Encoded length:", fullEncoding.encodingInfo.finalLength, "characters");
  console.log("Overhead:", fullEncoding.encodingInfo.finalLength - fullEncoding.encodingInfo.originalLength, "characters");
  
  // Test decoding
  console.log("\n=== DECODING WITH ALL METHODS INTACT ===");
  const fullDecoding = decodeEnhancedContent(
    fullEncoding.content,
    fullEncoding.signature,
    keyManager
  );
  
  if (!fullDecoding || !fullDecoding.metadata) {
    console.error("Failed to decode content");
    return;
  }
  
  console.log("Verified signer:", fullDecoding.signerName);
  console.log("Extracted from:", fullDecoding.extractionSource);
  console.log("Integrity check:", fullDecoding.integrity ? "PASSED ✓" : "FAILED ✗");
  console.log("Extracted metadata:", fullDecoding.metadata);
  
  // Simulate content transformation by stripping zero-width characters
  console.log("\n=== SIMULATION: CONTENT AFTER ZERO-WIDTH CHARACTER STRIPPING ===");
  const strippedContent = fullEncoding.content
    .replace(/[\u200B-\u200D]/g, ''); // Strip all zero-width characters
  
  console.log("Original encoded length:", fullEncoding.content.length);
  console.log("Length after stripping:", strippedContent.length);
  console.log("Characters removed:", fullEncoding.content.length - strippedContent.length);
  
  // Test decoding after transformation
  console.log("\n=== DECODING AFTER ZERO-WIDTH STRIPPING ===");
  const transformedDecoding = decodeEnhancedContent(
    strippedContent,
    fullEncoding.signature,
    keyManager
  );
  
  if (!transformedDecoding || !transformedDecoding.metadata) {
    console.error("Failed to decode transformed content");
    return;
  }
  
  console.log("Verified signer:", transformedDecoding.signerName);
  console.log("Extracted from:", transformedDecoding.extractionSource);
  console.log("Integrity check:", transformedDecoding.integrity ? "PASSED ✓" : "FAILED ✗");
  console.log("Extracted metadata:", transformedDecoding.metadata);
  
  // Validate metadata integrity
  console.log("\n=== METADATA INTEGRITY VERIFICATION ===");
  if (transformedDecoding.metadata) {
    let matches = true;
    const results: string[] = [];
    
    for (const [key, value] of Object.entries(metadata)) {
      if (transformedDecoding.metadata[key] !== value) {
        matches = false;
        results.push(`× ${key}: MISMATCH (expected ${value}, got ${transformedDecoding.metadata[key]})`);
      } else {
        results.push(`✓ ${key}: ${value}`);
      }
    }
    
    console.log(matches ? 
      "✓ All metadata values survived transformation intact" : 
      "× Some metadata values were altered during transformation");
    
    console.log(results.join('\n'));
  }
};

// Auto-run the demonstration if this file is executed directly
if (require.main === module) {
  runEnhancedDemo().catch(console.error);
}