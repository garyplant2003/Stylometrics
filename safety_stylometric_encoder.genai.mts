/**
 * Stylometric Steganography Module
 * 
 * This module provides linguistic steganography capabilities by encoding data into
 * natural language text patterns without using invisible characters. It manipulates
 * sentence structure, word patterns, and linguistic features to embed data while 
 * maintaining readability and plausible deniability.
 * 
 * Flow: 
 * Input text → Split into units → Encode bits by pattern transforms → Combine → Output
 */

import crypto from 'crypto';

/**
 * Common word categories used for stylometric transformations
 */
interface CommonWords {
    articles: string[];
    adjectives: {
        1: string[];
        2: string[];
        3: string[];
        [key: number]: string[];
    };
    adverbs: string[];
    conjunctions: string[];
}

/**
 * Sentence pattern templates for encoding
 */
interface SentencePatterns {
    simple: string[];
    compound: string[];
    complex: string[];
    [key: string]: string[];
}

// Common English words for each category we can substitute
const COMMON_WORDS: CommonWords = {
    // Articles with word lengths (1: a, 2: an, 3: the)
    articles: ['a', 'an', 'the'],
    
    // Common adjectives organized by syllable count
    adjectives: {
        1: ['big', 'small', 'great', 'good', 'bad', 'quick', 'slow', 'cold', 'hot', 'new'],
        2: ['better', 'faster', 'slower', 'larger', 'smaller', 'colder', 'warmer', 'nicer'],
        3: ['beautiful', 'excellent', 'wonderful', 'difficult', 'important', 'practical'],
    },
    
    // Common adverbs that can be added/removed to encode bits
    adverbs: ['very', 'quite', 'rather', 'somewhat', 'extremely', 'fairly', 'pretty', 'really'],
    
    // Sentence conjunctions (joining words)
    conjunctions: ['and', 'but', 'or', 'so', 'yet', 'for', 'nor']
};

// Sentence templates with various structures for encoding
const SENTENCE_PATTERNS: SentencePatterns = {
    // Basic simple pattern
    simple: [
        "The {adj1} {noun} {verb}.",
        "{noun} {verb} {adverb}.",
        "A {adj1} {noun} {verb} {adverb}."
    ],
    
    // Compound patterns
    compound: [
        "The {adj1} {noun} {verb}, {conj} the {adj2} {noun2} {verb2}.",
        "{noun} {verb} {adverb}, {conj} {noun2} {verb2}."
    ],
    
    // Complex patterns with subordinate clauses
    complex: [
        "Although the {adj1} {noun} {verb}, the {adj2} {noun2} {verb2}.",
        "When {noun} {verb}, the {adj1} {noun2} {verb2} {adverb}."
    ]
};

/**
 * Encodes a bit string by manipulating sentence structures and word choices
 * @param text Original text content to embed data within
 * @param bitsToEncode Binary string of bits to encode
 * @returns Modified text with embedded bits
 */
const encodeStylometricBits = (text: string, bitsToEncode: string): string => {
    // Split text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length < bitsToEncode.length) {
        throw new Error("Text too short to encode the required bits");
    }
    
    let encodedText = '';
    let bitIndex = 0;
    
    // Process each sentence to encode bits
    for (let i = 0; i < sentences.length && bitIndex < bitsToEncode.length; i++) {
        const sentence = sentences[i].trim();
        const bit = bitsToEncode[bitIndex];
        
        // Skip sentences that are too short or lack proper structure
        if (sentence.split(' ').length < 3) {
            encodedText += sentence + ' ';
            continue;
        }
        
        // Encode bit 0: Use simple sentence structure or active voice
        // Encode bit 1: Use complex sentence structure or passive voice
        if (bit === '0') {
            // Simple transformations for bit 0
            let modified = sentence;
            
            // Remove certain adverbs if present
            COMMON_WORDS.adverbs.forEach(adverb => {
                if (Math.random() > 0.7 && modified.includes(' ' + adverb + ' ')) {
                    modified = modified.replace(' ' + adverb + ' ', ' ');
                }
            });
            
            // End sentences with periods for bit 0
            if (modified.endsWith('!') || modified.endsWith('?')) {
                modified = modified.slice(0, -1) + '.';
            }
            
            encodedText += modified + ' ';
        } else {
            // Complex transformations for bit 1
            let modified = sentence;
            
            // Add adverbs for bit 1
            if (Math.random() > 0.7) {
                const words = modified.split(' ');
                const randomPosition = Math.floor(Math.random() * (words.length - 1)) + 1;
                const randomAdverb = COMMON_WORDS.adverbs[Math.floor(Math.random() * COMMON_WORDS.adverbs.length)];
                words.splice(randomPosition, 0, randomAdverb);
                modified = words.join(' ');
            }
            
            // Use exclamation or question mark for bit 1
            if (modified.endsWith('.')) {
                modified = modified.slice(0, -1) + (Math.random() > 0.5 ? '!' : '?');
            }
            
            encodedText += modified + ' ';
        }
        
        bitIndex++;
    }
    
    // Add remaining sentences
    for (let i = bitIndex; i < sentences.length; i++) {
        encodedText += sentences[i] + ' ';
    }
    
    return encodedText.trim();
};

/**
 * Encodes data using paragraph structure and punctuation patterns
 * @param text Text to encode within
 * @param dataToEncode String data to hide
 * @returns Text with stylometrically encoded data
 * @throws Error if text does not have enough paragraphs for encoding
 */
export const hideDataStylometrically = (text: string, dataToEncode: string): string => {
    // Convert data to binary
    const binaryData = Array.from(dataToEncode)
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('');
    
    // Encode length as 16-bit binary
    const lengthBinary = binaryData.length.toString(2).padStart(16, '0');
    
    // Combine length header and data bits
    const bitsToEncode = lengthBinary + binaryData;
    
    // Add marker signature at start (linguistic pattern variation)
    const markerText = "Please note the following information carefully. ";
    
    // Split text into paragraphs
    const paragraphs = text.split('\n\n');
    
    // Ensure we have enough text to encode our data
    if (paragraphs.length < 2) {
        throw new Error("Text needs multiple paragraphs for stylometric encoding");
    }
    
    // Encode the data into the paragraphs
    let encodedText = "";
    if (paragraphs[0].trim().length > 0) {
        // Insert our marker at the beginning of the text
        encodedText += markerText + paragraphs[0] + '\n\n';
    } else {
        encodedText += markerText + '\n\n';
    }
    
    // Process middle paragraphs to encode our bits
    for (let i = 1; i < paragraphs.length - 1; i++) {
        if (paragraphs[i].trim().length > 0) {
            encodedText += encodeStylometricBits(paragraphs[i], bitsToEncode) + '\n\n';
            break; // Only encode in one paragraph for now
        }
    }
    
    // Add remaining paragraphs
    for (let i = 2; i < paragraphs.length; i++) {
        encodedText += paragraphs[i];
        if (i < paragraphs.length - 1) {
            encodedText += '\n\n';
        }
    }
    
    return encodedText;
};

/**
 * Extracts bits from text based on stylometric patterns
 * @param text Text with encoded data
 * @returns Extracted binary string or null if not found
 */
const extractStylometricBits = (text: string): string | null => {
    // Check for marker signature
    if (!text.includes("Please note the following information carefully.")) {
        return null;
    }
    
    // Split text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    let extractedBits = '';
    
    // Skip the first few sentences (marker area)
    const startIndex = 2;
    
    // Process sentences to extract bits
    for (let i = startIndex; i < sentences.length; i++) {
        const sentence = sentences[i].trim();
        
        // Skip sentences that are too short
        if (sentence.split(' ').length < 3) {
            continue;
        }
        
        // Check for bit 1 patterns
        if ((sentence.endsWith('!') || sentence.endsWith('?')) || 
            COMMON_WORDS.adverbs.some(adverb => sentence.includes(' ' + adverb + ' '))) {
            extractedBits += '1';
        } else {
            // Default to bit 0
            extractedBits += '0';
        }
        
        // Break if we have at least 16 bits (the length header)
        if (extractedBits.length >= 16) {
            const lengthBits = extractedBits.substring(0, 16);
            const dataLength = parseInt(lengthBits, 2);
            
            // If we have enough bits for the full data, stop
            if (extractedBits.length >= 16 + dataLength) {
                break;
            }
        }
    }
    
    // Check if we have at least 16 bits for the length
    if (extractedBits.length < 16) {
        return null;
    }
    
    return extractedBits;
};

/**
 * Extracts hidden data from text with stylometric encoding
 * @param text Text to analyze
 * @returns Extracted string or null if not found
 */
export const extractHiddenStylometricData = (text: string): string | null => {
    // Extract binary bits from the text
    const extractedBits = extractStylometricBits(text);
    if (!extractedBits || extractedBits.length < 16) {
        return null;
    }
    
    // Extract length from first 16 bits
    const lengthBits = extractedBits.substring(0, 16);
    const dataLength = parseInt(lengthBits, 2);
    
    // Ensure we have enough bits
    if (extractedBits.length < 16 + dataLength) {
        return null;
    }
    
    // Extract data bits
    const dataBits = extractedBits.substring(16, 16 + dataLength);
    
    // Convert binary to string
    let result = '';
    for (let i = 0; i < dataBits.length; i += 8) {
        const byte = dataBits.substr(i, 8);
        if (byte.length === 8) {
            result += String.fromCharCode(parseInt(byte, 2));
        }
    }
    
    return result;
};

/**
 * Demonstrates the stylometric encoding/decoding process
 * @param originalText The text content to use for the demonstration
 * @param dataToHide The data to hide within the text
 */
export const demonstrateStylometricEncoding = (originalText: string, dataToHide: string): void => {
    console.log("Original text:");
    console.log(originalText);
    console.log("\n=== ENCODING DATA ===\n");
    
    const encodedText = hideDataStylometrically(originalText, dataToHide);
    console.log("Text with hidden data:");
    console.log(encodedText);
    console.log("\n=== DECODING DATA ===\n");
    
    const extractedData = extractHiddenStylometricData(encodedText);
    console.log("Extracted data:", extractedData);
    console.log("Original data:", dataToHide);
    console.log("Match:", extractedData === dataToHide);
};