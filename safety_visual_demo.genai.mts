/**
 * Visual Steganographic Encoding Demonstration
 * 
 * This module provides concrete examples showing the visual effects (or lack thereof)
 * of applying steganographic encoding to text content. It demonstrates how content
 * appears unchanged to humans while containing embedded metadata.
 * 
 * Flow: Generate Sample → Show Original → Apply Encoding → Show "Visually" → 
 *       Demonstrate Extraction → Verify Integrity
 */

import crypto from 'crypto';
import fs from 'fs';
import util from 'util';
import path from 'path';
import { 
  KeyManager, 
  encodeMultilayerContent, 
  decodeMultilayerContent 
} from './safety_encoder_demo.genai.mts';

/**
 * Helper function to visualize zero-width characters in text
 * @param text Text that may contain zero-width characters
 * @returns Text with zero-width characters made visible through substitution
 */
const visualizeZeroWidth = (text: string): string => {
  return text
    .replace(/\u200B/g, '⟨ZWSP⟩')  // Zero-width space
    .replace(/\u200C/g, '⟨ZWNJ⟩')  // Zero-width non-joiner
    .replace(/\u200D/g, '⟨ZWJ⟩');  // Zero-width joiner
};

/**
 * Demonstrates steganographic encoding with detailed visual representation
 * and explanation of the process
 */
export const demonstrateVisualSteganography = async (): Promise<void> => {
  // Create output directory for visualization files
  const outputDir = path.join(__dirname, 'demo-output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Setup key manager and identities
  const keyManager = new KeyManager();
  const alice = keyManager.generateNewKeyPair("alice");
  console.log(`Generated key pair for Alice (keyId: ${alice.keyId})\n`);
  
  // ===== DEMONSTRATION TEXT =====
  // Note: Ensure text is long enough for both encoding methods to work properly
  const originalText = `
# Project Status Report - April 2025

## Executive Summary
The A-Finite-Monkey-Engine project has made substantial progress in the first quarter. 
We've completed the core steganographic implementation and verification system, allowing
for reliable content tracking with cryptographic signatures.

## Key Accomplishments
- Implemented dual-layer steganographic encoding
- Completed key management infrastructure
- Established verification protocols
- Initiated user acceptance testing

## Risks and Mitigations
While our current approach provides redundant encoding mechanisms, there remains
a small risk of detection by advanced analysis tools. We're continuing research
into additional encoding techniques to further enhance plausible deniability.

## Next Steps
The team will focus on integrating the system with our production content delivery
platform, with an expected completion date of May 15th.
`;

  console.log("ORIGINAL TEXT:\n" + "-".repeat(50));
  console.log(originalText);
  console.log("-".repeat(50) + "\n");
  
  // Save original text to file
  fs.writeFileSync(
    path.join(outputDir, '1-original.txt'), 
    originalText,
    'utf8'
  );
  
  // Generate metadata to embed
  const metadata = {
    creator: "alice",
    keyId: alice.keyId,
    timestamp: new Date().toISOString(),
    documentId: crypto.randomBytes(4).toString('hex'),
    classification: "internal",
    version: "1.2.0",
    department: "Engineering"
  };
  
  console.log("METADATA TO EMBED:");
  console.log(util.inspect(metadata, { colors: true, depth: null }));
  console.log();
  
  // Perform multilayer encoding
  console.log("APPLYING STEGANOGRAPHIC ENCODING...");
  const encodedPackage = encodeMultilayerContent(
    originalText, 
    metadata, 
    keyManager, 
    "alice"
  );
  
  if (!encodedPackage) {
    console.error("Failed to encode content");
    return;
  }
  
  console.log("Encoding complete!\n");
  
  // ==== COMPARISON BETWEEN ORIGINAL AND ENCODED ====
  
  console.log("ENCODED TEXT (AS IT APPEARS TO HUMANS):\n" + "-".repeat(50));
  // This will look identical to the original when viewed normally
  console.log(encodedPackage.content);
  console.log("-".repeat(50) + "\n");
  
  // Save encoded text to file
  fs.writeFileSync(
    path.join(outputDir, '2-encoded.txt'), 
    encodedPackage.content,
    'utf8'
  );
  
  // ==== VISUALIZATION OF THE ENCODING ====
  
  console.log("ENCODED TEXT (WITH ZERO-WIDTH CHARACTERS VISUALIZED):\n" + "-".repeat(50));
  console.log(visualizeZeroWidth(encodedPackage.content));
  console.log("-".repeat(50) + "\n");
  
  // Save visualized text to file
  fs.writeFileSync(
    path.join(outputDir, '3-visualized.txt'), 
    visualizeZeroWidth(encodedPackage.content),
    'utf8'
  );
  
  // ==== EXTRACTION DEMONSTRATION ====
  
  console.log("VERIFICATION AND EXTRACTION PROCESS:");
  console.log("-".repeat(50));
  
  // Extract and verify the encoded content
  const extractionResult = decodeMultilayerContent(
    encodedPackage.content,
    encodedPackage.signature,
    keyManager
  );
  
  if (!extractionResult) {
    console.error("Failed to decode the content");
    return;
  }
  
  console.log(`Signature verification: ${extractionResult.signerName ? '✓ VALID' : '✗ INVALID'}`);
  console.log(`Signed by: ${extractionResult.signerName}`);
  console.log();
  
  console.log("EXTRACTED METADATA:");
  console.log(util.inspect(extractionResult.metadata, { colors: true, depth: null }));
  console.log();
  
  // ==== METADATA INTEGRITY CHECK ====
  
  console.log("METADATA INTEGRITY CHECK:");
  if (extractionResult.metadata) {
    let matches = true;
    let matchResults = [];
    
    for (const [key, value] of Object.entries(metadata)) {
      const extracted = extractionResult.metadata[key];
      const isMatch = extracted === value;
      matches = matches && isMatch;
      
      matchResults.push(`- ${key}: ${isMatch ? '✓' : '✗'} (${String(value).substring(0, 30)}${String(value).length > 30 ? '...' : ''})`);
    }
    
    if (matches) {
      console.log("✓ All metadata values match the original data");
    } else {
      console.log("✗ Some metadata values don't match the original");
    }
    
    console.log(matchResults.join('\n'));
  }
  
  console.log("-".repeat(50));
  console.log();
  
  // ==== SUMMARY OF DEMONSTRATION ====
  
  console.log("DEMONSTRATION SUMMARY:");
  console.log("-".repeat(50));
  console.log("1. Original content length: " + originalText.length + " characters");
  console.log("2. Encoded content length: " + encodedPackage.content.length + " characters");
  console.log("3. Difference: " + (encodedPackage.content.length - originalText.length) + " characters (hidden data)");
  console.log("4. Metadata JSON size: " + JSON.stringify(metadata).length + " characters");
  console.log("5. Signature length: " + encodedPackage.signature.length + " characters");
  console.log();
  
  console.log("Output files have been saved to: " + outputDir);
  console.log("- 1-original.txt: The original unmodified text");
  console.log("- 2-encoded.txt: Text with embedded metadata (appears visually identical)");
  console.log("- 3-visualized.txt: Encoded text with zero-width characters made visible");
  console.log("-".repeat(50));
  
  // Create manifest of the demonstration
  const manifest = {
    generatedAt: new Date().toISOString(),
    originalTextLength: originalText.length,
    encodedTextLength: encodedPackage.content.length,
    hiddenCharacters: encodedPackage.content.length - originalText.length,
    metadataSize: JSON.stringify(metadata).length,
    signatureLength: encodedPackage.signature.length,
    extractionSuccessful: !!extractionResult,
    signatureValid: !!extractionResult?.signerName,
    metadataIntact: extractionResult?.metadata ? 
      Object.entries(metadata).every(([k, v]) => extractionResult.metadata[k] === v) : 
      false
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'demo-manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );
};

// Auto-run the demonstration if this file is executed directly
if (require.main === module) {
  demonstrateVisualSteganography().catch(console.error);
}