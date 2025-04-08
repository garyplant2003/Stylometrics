/**
 * Structural Steganography Module
 * 
 * This module implements high-order linguistic steganography designed to survive
 * transcoding, transformation, and even translation. It works by encoding data at
 * multiple structural levels - from narrative structure to dialogue patterns,
 * paragraph construction, rhetorical devices, and viewpoint shifts.
 * 
 * Flow:
 * Content → Split → Multi-level structural encoding → Combine → Output
 *
 * Design Philosophy:
 * While zero-width and stylometric encoding focus on character-level and sentence-level
 * features, structural encoding creates patterns across larger content units that are
 * more likely to be preserved even when the specific words change.
 */

import crypto from 'crypto';

/**
 * Configuration for the structural encoding process
 */
interface StructuralEncodingOptions {
  // Minimum length of content required for effective encoding
  minContentLength: number;
  
  // Maximum bits to encode (based on available content structures)
  maxEncodableBits: number;
  
  // Whether to attempt to preserve existing structure where possible
  preserveExistingStructure: boolean;
  
  // Level of encoding aggressiveness (higher = more transformations, more noticeable)
  encodingStrength: 'subtle' | 'moderate' | 'aggressive';
}

/**
 * Represents various narrative structures for encoding
 */
interface NarrativePatterns {
  // First-person narrative patterns
  firstPerson: string[];
  
  // Third-person narrative patterns
  thirdPerson: string[];
  
  // Dialogue-heavy patterns
  dialogue: string[];
  
  // Descriptive passage patterns
  descriptive: string[];
}

/**
 * Maps encoding bit patterns to narrative structures and devices
 */
const NARRATIVE_PATTERNS: NarrativePatterns = {
  // First-person narrative patterns (bit 0)
  firstPerson: [
    "I remember when",
    "As I considered",
    "In my experience",
    "Looking back, I realized",
    "From my perspective"
  ],
  
  // Third-person narrative patterns (bit 1)
  thirdPerson: [
    "They observed that",
    "From their viewpoint",
    "It became clear to them",
    "After consideration, she decided",
    "He recognized the pattern"
  ],
  
  // Dialogue patterns for bits (alternating speakers = 0, same speaker = 1)
  dialogue: [
    '"I see your point," she said. "Tell me more about that approach."',
    '"Consider the implications," he suggested. "What happens when we apply this further?"',
    '"That\'s interesting. And what about the alternative?" they asked.',
    '"This reveals something important. We should examine it carefully," noted the researcher.'
  ],
  
  // Descriptive passage patterns (concrete = 0, abstract = 1)
  descriptive: [
    "The structure stood thirty feet tall, metal beams intersecting at precise angles.",
    "Connections between concepts formed gradually, like a photograph developing.",
    "The room contained three chairs, a table, and a cabinet with seven drawers.",
    "Ideas floated through the discussion, nebulous at first, then crystallizing."
  ]
};

/**
 * Paragraph structure encoding patterns
 */
enum ParagraphPattern {
  // Short-long alternating paragraphs (bit 0)
  ShortLongAlternating = 0,
  
  // Consistent medium-length paragraphs (bit 1)
  ConsistentMedium = 1,
  
  // Decreasing length paragraphs (bit 0)
  DecreasingLength = 0,
  
  // Increasing length paragraphs (bit 1)
  IncreasingLength = 1
}

/**
 * Rhetorical device encoding patterns
 */
enum RhetoricalPattern {
  // Question at paragraph end (bit 0)
  EndingQuestion = 0,
  
  // Statement with emphasis at paragraph end (bit 1)
  EndingEmphasis = 1,
  
  // Metaphorical language (bit 0)
  Metaphorical = 0,
  
  // Direct language (bit 1)
  Direct = 1,
  
  // Supporting example after claim (bit 0)
  ClaimThenExample = 0,
  
  // Example followed by conclusion (bit 1)
  ExampleThenClaim = 1
}

/**
 * Analysis results for a content unit (paragraph, section, etc.)
 */
interface ContentUnitAnalysis {
  wordCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  complexity: number; // Measure of linguistic complexity
  pov: 'first' | 'second' | 'third' | 'mixed';
  tense: 'past' | 'present' | 'future' | 'mixed';
  rhetorical: RhetoricalPattern[];
  dialectic: 'argumentative' | 'descriptive' | 'narrative' | 'mixed';
}

/**
 * Default options for structural encoding
 */
const DEFAULT_OPTIONS: StructuralEncodingOptions = {
  minContentLength: 1000,
  maxEncodableBits: 64,
  preserveExistingStructure: true,
  encodingStrength: 'moderate'
};

/**
 * Analyzes a section of text to determine its structural characteristics
 * @param text Content to analyze
 * @returns Analysis of content structure
 */
const analyzeContentUnit = (text: string): ContentUnitAnalysis => {
  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  // Count words
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  // Detect point of view
  const firstPersonIndicators = text.match(/\b(I|me|my|mine|myself)\b/gi) || [];
  const secondPersonIndicators = text.match(/\b(you|your|yours|yourself)\b/gi) || [];
  const thirdPersonIndicators = text.match(/\b(he|she|it|they|him|her|them|his|hers|their|theirs)\b/gi) || [];
  
  let pov: 'first' | 'second' | 'third' | 'mixed' = 'mixed';
  
  // Determine dominant POV
  const povCounts = [
    firstPersonIndicators.length,
    secondPersonIndicators.length,
    thirdPersonIndicators.length
  ];
  const maxPovCount = Math.max(...povCounts);
  
  if (maxPovCount > 0 && maxPovCount >= 2 * (povCounts.reduce((a, b) => a + b, 0) - maxPovCount)) {
    // If one POV is at least twice as frequent as all others combined
    if (povCounts[0] === maxPovCount) pov = 'first';
    else if (povCounts[1] === maxPovCount) pov = 'second';
    else pov = 'third';
  }
  
  // Detect tense (simplified)
  const pastTenseIndicators = text.match(/\b(\w+ed|was|were|had)\b/gi) || [];
  const presentTenseIndicators = text.match(/\b(is|are|am|being)\b/gi) || [];
  const futureTenseIndicators = text.match(/\b(will|shall|going to)\b/gi) || [];
  
  let tense: 'past' | 'present' | 'future' | 'mixed' = 'mixed';
  
  // Determine dominant tense
  const tenseCounts = [
    pastTenseIndicators.length,
    presentTenseIndicators.length,
    futureTenseIndicators.length
  ];
  const maxTenseCount = Math.max(...tenseCounts);
  
  if (maxTenseCount > 0 && maxTenseCount >= 2 * (tenseCounts.reduce((a, b) => a + b, 0) - maxTenseCount)) {
    // If one tense is at least twice as frequent as all others combined
    if (tenseCounts[0] === maxTenseCount) tense = 'past';
    else if (tenseCounts[1] === maxTenseCount) tense = 'present';
    else tense = 'future';
  }
  
  // Detect rhetorical patterns
  const rhetorical: RhetoricalPattern[] = [];
  
  // Check for questions at paragraph end
  if (sentences.length > 0 && sentences[sentences.length - 1].trim().endsWith('?')) {
    rhetorical.push(RhetoricalPattern.EndingQuestion);
  } else {
    // Check for emphasis (!, strong statements) at paragraph end
    if (sentences.length > 0 && 
        (sentences[sentences.length - 1].trim().endsWith('!') ||
         sentences[sentences.length - 1].match(/\b(certainly|definitely|absolutely|crucial|essential|critical)\b/i))) {
      rhetorical.push(RhetoricalPattern.EndingEmphasis);
    }
  }
  
  // Check for metaphorical language
  const metaphorIndicators = text.match(/\b(like|as if|as though|resembles|similar to)\b/gi) || [];
  if (metaphorIndicators.length > 0) {
    rhetorical.push(RhetoricalPattern.Metaphorical);
  } else {
    rhetorical.push(RhetoricalPattern.Direct);
  }
  
  // Detect dialectic structure (simplified)
  const argumentativeIndicators = text.match(/\b(because|therefore|thus|hence|so|consequently)\b/gi) || [];
  const descriptiveIndicators = text.match(/\b(appears|looks|seems|features|contains|consists)\b/gi) || [];
  const narrativeIndicators = text.match(/\b(then|next|after|before|finally|eventually)\b/gi) || [];
  
  let dialectic: 'argumentative' | 'descriptive' | 'narrative' | 'mixed' = 'mixed';
  
  // Determine dominant dialectic
  const dialecticCounts = [
    argumentativeIndicators.length,
    descriptiveIndicators.length,
    narrativeIndicators.length
  ];
  const maxDialecticCount = Math.max(...dialecticCounts);
  
  if (maxDialecticCount > 0 && maxDialecticCount > dialecticCounts.reduce((a, b) => a + b, 0) / 2) {
    // If one dialectic form is more than half the total
    if (dialecticCounts[0] === maxDialecticCount) dialectic = 'argumentative';
    else if (dialecticCounts[1] === maxDialecticCount) dialectic = 'descriptive';
    else dialectic = 'narrative';
  }
  
  // Calculate complexity (simple heuristic based on sentence length and vocabulary diversity)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const lexicalDiversity = uniqueWords.size / words.length;
  const complexity = (sentences.length > 0 ? words.length / sentences.length : 0) * lexicalDiversity * 10;
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    averageSentenceLength: sentences.length > 0 ? words.length / sentences.length : 0,
    complexity,
    pov,
    tense,
    rhetorical,
    dialectic
  };
};

/**
 * Splits content into workable structural units (paragraphs, sections)
 * @param content Full text content
 * @returns Array of content units
 */
const splitContentIntoUnits = (content: string): string[] => {
  // Split by double line break to get paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // If we have very few paragraphs, try to split further by sentences
  if (paragraphs.length < 5) {
    // Create more units by grouping sentences
    const allSentences = content.match(/[^.!?]+[.!?]+/g) || [];
    
    // Group sentences into units of 2-4 sentences
    const units: string[] = [];
    let currentUnit = '';
    let sentenceCount = 0;
    
    for (const sentence of allSentences) {
      currentUnit += sentence;
      sentenceCount++;
      
      if (sentenceCount >= 3 || currentUnit.length > 200) {
        units.push(currentUnit);
        currentUnit = '';
        sentenceCount = 0;
      }
    }
    
    if (currentUnit.length > 0) {
      units.push(currentUnit);
    }
    
    return units;
  }
  
  return paragraphs;
};

/**
 * Transforms content structure to encode a bit
 * @param contentUnit Text unit to transform
 * @param bit Bit to encode (0 or 1)
 * @param options Encoding options
 * @returns Transformed content unit
 */
const transformContentStructure = (
  contentUnit: string, 
  bit: number,
  options: StructuralEncodingOptions
): string => {
  // Analyze the content unit first
  const analysis = analyzeContentUnit(contentUnit);
  
  // Choose transformation strategy based on unit characteristics
  let transformed = contentUnit;
  
  // Apply transformation based on encoding strength
  if (options.encodingStrength === 'aggressive') {
    // Apply multiple transformations
    transformed = transformPointOfView(transformed, bit);
    transformed = transformRhetoricalStructure(transformed, bit, analysis);
    transformed = transformTense(transformed, bit);
  } else if (options.encodingStrength === 'moderate') {
    // Apply 1-2 transformations
    if (contentUnit.length > 150) {
      transformed = transformPointOfView(transformed, bit);
    }
    transformed = transformRhetoricalStructure(transformed, bit, analysis);
  } else {
    // Subtle - apply minimal transformations
    transformed = transformRhetoricalStructure(transformed, bit, analysis);
  }
  
  return transformed;
};

/**
 * Transforms the point of view to encode a bit
 * @param text Content to transform
 * @param bit Bit to encode (0 or 1)
 * @returns Transformed text
 */
const transformPointOfView = (text: string, bit: number): string => {
  // For bit 0, prefer first-person narrative
  // For bit 1, prefer third-person narrative
  if (bit === 0) {
    // Choose a random first-person pattern to inject or enhance
    const pattern = NARRATIVE_PATTERNS.firstPerson[
      Math.floor(Math.random() * NARRATIVE_PATTERNS.firstPerson.length)
    ];
    
    if (!text.match(/\b(I|me|my|mine|myself)\b/i)) {
      // No first person markers found, insert the pattern
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      if (sentences.length > 0) {
        // Insert at beginning or replace first sentence
        return `${pattern} ${text.replace(sentences[0], '')}`;
      }
    } else {
      // Already has first person, enhance it
      return text;
    }
  } else { // bit === 1
    // Choose a random third-person pattern to inject or enhance
    const pattern = NARRATIVE_PATTERNS.thirdPerson[
      Math.floor(Math.random() * NARRATIVE_PATTERNS.thirdPerson.length)
    ];
    
    if (!text.match(/\b(he|she|it|they|him|her|them|his|hers|their|theirs)\b/i)) {
      // No third person markers found, insert the pattern
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      if (sentences.length > 0) {
        // Insert at beginning or replace first sentence
        return `${pattern} ${text.replace(sentences[0], '')}`;
      }
    } else {
      // Already has third person, enhance it
      return text;
    }
  }
  
  return text;
};

/**
 * Transforms the tense to encode a bit
 * @param text Content to transform
 * @param bit Bit to encode (0 or 1)
 * @returns Transformed text
 */
const transformTense = (text: string, bit: number): string => {
  // Simple tense transformation - doesn't actually change all verbs,
  // just introduces tense indicators
  if (bit === 0) {
    // Introduce past tense indicators
    if (!text.match(/\b(had|was|were|previously|earlier|before|yesterday)\b/i)) {
      return text.replace(/\. /, '. Previously, ');
    }
  } else {
    // Introduce future tense indicators
    if (!text.match(/\b(will|shall|going to|soon|eventually|tomorrow)\b/i)) {
      return text.replace(/\. /, '. Eventually, ');
    }
  }
  
  return text;
};

/**
 * Transforms the rhetorical structure to encode a bit
 * @param text Content to transform
 * @param bit Bit to encode (0 or 1)
 * @param analysis Analysis of the content
 * @returns Transformed text
 */
const transformRhetoricalStructure = (
  text: string, 
  bit: number, 
  analysis: ContentUnitAnalysis
): string => {
  // Get last sentence
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length === 0) return text;
  
  const lastSentence = sentences[sentences.length - 1];
  let transformed = text;
  
  if (bit === 0) {
    // Bit 0: End with a question if not already
    if (!lastSentence.trim().endsWith('?')) {
      // Remove last sentence and add a question
      transformed = text.substring(0, text.length - lastSentence.length);
      
      // Create a question based on the content of the last sentence
      if (lastSentence.match(/\b(is|are|was|were|will|should|could|would|can)\b/i)) {
        // Convert to question by moving verb
        const questionForm = lastSentence.replace(/\b((\w+)\s+(is|are|was|were|will|should|could|would|can))\b/i, 
          (match, p1, p2, verb) => `${verb} ${p2}`);
        transformed += questionForm;
      } else {
        // Add a generic question
        transformed += `Might we consider how ${lastSentence.trim().replace(/[.!]+$/, '?')}`;
      }
    }
  } else {
    // Bit 1: End with emphasis or strong statement if not already
    if (!lastSentence.trim().endsWith('!') && 
        !lastSentence.match(/\b(certainly|definitely|absolutely|crucial|essential|critical)\b/i)) {
      // Remove last sentence and add an emphatic statement
      transformed = text.substring(0, text.length - lastSentence.length);
      transformed += lastSentence.trim().replace(/[.?]+$/, '!');
    }
  }
  
  return transformed;
};

/**
 * Transforms paragraph length patterns to encode bits
 * @param contentUnits Array of content units
 * @param bitsToEncode Bits to encode
 * @param options Encoding options
 * @returns Transformed content units
 */
const transformParagraphPatterns = (
  contentUnits: string[], 
  bitsToEncode: string, 
  options: StructuralEncodingOptions
): string[] => {
  // If not enough units, return unchanged
  if (contentUnits.length < 4) return contentUnits;
  
  let bitIndex = 0;
  const transformed: string[] = [];
  
  // Group units into sections of 3-4 units each
  for (let i = 0; i < contentUnits.length && bitIndex < bitsToEncode.length; i += 4) {
    const section = contentUnits.slice(i, Math.min(i + 4, contentUnits.length));
    
    if (section.length >= 3) {
      const bit = parseInt(bitsToEncode[bitIndex], 10);
      
      // Apply paragraph length pattern
      if (bit === 0) {
        // Alternating short-long paragraphs for bit 0
        for (let j = 0; j < section.length; j++) {
          if (j % 2 === 0) {
            // Make paragraph shorter
            transformed.push(makeParagraphShorter(section[j]));
          } else {
            // Make paragraph longer
            transformed.push(makeParagraphLonger(section[j]));
          }
        }
      } else {
        // Consistent medium-length paragraphs for bit 1
        for (let j = 0; j < section.length; j++) {
          transformed.push(makeParagraphMedium(section[j]));
        }
      }
      
      bitIndex++;
    } else {
      // Not enough paragraphs in this section, keep unchanged
      transformed.push(...section);
    }
  }
  
  // Add any remaining units unchanged
  if (contentUnits.length > transformed.length) {
    transformed.push(...contentUnits.slice(transformed.length));
  }
  
  return transformed;
};

/**
 * Makes a paragraph shorter by removing details or combining sentences
 * @param paragraph Paragraph to modify
 * @returns Shortened paragraph
 */
const makeParagraphShorter = (paragraph: string): string => {
  const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [];
  
  if (sentences.length <= 2) return paragraph;
  
  // Remove middle sentence(s)
  return sentences[0] + ' ' + sentences[sentences.length - 1];
};

/**
 * Makes a paragraph longer by adding descriptions or elaborations
 * @param paragraph Paragraph to modify
 * @returns Lengthened paragraph
 */
const makeParagraphLonger = (paragraph: string): string => {
  const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [];
  
  if (sentences.length === 0) return paragraph;
  
  // Add elaboration sentence
  const elaborations = [
    "This illustrates the key principle at work. ",
    "The implications of this are significant. ",
    "Several factors contribute to this outcome. ",
    "This represents an important development. ",
    "Multiple perspectives can be applied to this situation. "
  ];
  
  const elaboration = elaborations[Math.floor(Math.random() * elaborations.length)];
  
  // Insert before the last sentence
  if (sentences.length > 1) {
    const lastSentencePos = paragraph.lastIndexOf(sentences[sentences.length - 1]);
    return paragraph.substring(0, lastSentencePos) + elaboration + paragraph.substring(lastSentencePos);
  } else {
    return paragraph + ' ' + elaboration;
  }
};

/**
 * Adjusts a paragraph to be medium length
 * @param paragraph Paragraph to modify
 * @returns Medium-length paragraph
 */
const makeParagraphMedium = (paragraph: string): string => {
  const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [];
  
  if (sentences.length === 0) return paragraph;
  
  if (sentences.length > 3) {
    // Too long, shorten
    return sentences.slice(0, 3).join(' ');
  } else if (sentences.length < 2) {
    // Too short, expand
    const elaborations = [
      "This represents an important consideration. ",
      "The pattern continues in subsequent examples. "
    ];
    
    return paragraph + ' ' + elaborations[Math.floor(Math.random() * elaborations.length)];
  }
  
  return paragraph;
};

/**
 * Encodes data using multi-level structural patterns
 * @param text Text to encode data within
 * @param dataToHide Data to encode
 * @param options Encoding configuration
 * @returns Text with structurally encoded data
 */
export const hideDataStructurally = (
  text: string, 
  dataToHide: string,
  options: StructuralEncodingOptions = DEFAULT_OPTIONS
): string => {
  // Validate content length
  if (text.length < options.minContentLength) {
    throw new Error(`Content too short (${text.length} chars) for structural encoding. Minimum required: ${options.minContentLength}`);
  }
  
  // Convert data to binary
  const binaryData = Array.from(dataToHide)
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('');
  
  // Encode length as 16-bit binary
  const lengthBinary = binaryData.length.toString(2).padStart(16, '0');
  
  // Combine length header and data bits
  const bitsToEncode = lengthBinary + binaryData;
  
  // Validate encoding capacity
  const maxBits = Math.min(options.maxEncodableBits, bitsToEncode.length);
  console.log(`Encoding ${maxBits} bits of data structurally`);
  
  // Split content into workable units
  let contentUnits = splitContentIntoUnits(text);
  
  // First pass: Transform paragraph patterns
  contentUnits = transformParagraphPatterns(contentUnits, bitsToEncode.substring(0, Math.min(maxBits, 16)), options);
  
  // Second pass: Transform individual units for remaining bits
  for (let i = 0; i < contentUnits.length && i + 16 < maxBits; i++) {
    const bitIndex = i + 16;
    if (bitIndex < bitsToEncode.length) {
      const bit = parseInt(bitsToEncode[bitIndex], 10);
      contentUnits[i] = transformContentStructure(contentUnits[i], bit, options);
    }
  }
  
  // Add structural marker at beginning to aid detection
  const structuralMarker = "The following explores multiple perspectives. ";
  
  // Recombine content
  return structuralMarker + contentUnits.join('\n\n');
};

/**
 * Extracts data hidden using structural encoding
 * @param text Text that may contain structurally encoded data
 * @returns Extracted data string or null if none found
 */
export const extractHiddenStructuralData = (text: string): string | null => {
  // Check for structural marker
  if (!text.includes("The following explores multiple perspectives.")) {
    return null;
  }
  
  // Split into content units
  const contentUnits = splitContentIntoUnits(text);
  
  // Not enough units for encoding
  if (contentUnits.length < 4) {
    return null;
  }
  
  let extractedBits = '';
  
  // First extract bits from paragraph patterns (first 16 bits)
  // Group units into sections of 3-4 units each
  for (let i = 0; i < contentUnits.length && extractedBits.length < 16; i += 4) {
    const section = contentUnits.slice(i, Math.min(i + 4, contentUnits.length));
    
    if (section.length >= 3) {
      // Analyze pattern
      let shortLongPattern = true;
      let consistentLength = true;
      
      for (let j = 0; j < section.length - 1; j++) {
        const currentLength = section[j].length;
        const nextLength = section[j+1].length;
        
        // Check if pattern is short-long alternating
        if (j % 2 === 0) {
          if (currentLength >= nextLength) {
            shortLongPattern = false;
          }
        } else {
          if (currentLength <= nextLength) {
            shortLongPattern = false;
          }
        }
        
        // Check if consistent length
        if (Math.abs(currentLength - nextLength) > currentLength * 0.3) {
          consistentLength = false;
        }
      }
      
      // Extract bit based on pattern
      extractedBits += shortLongPattern ? '0' : '1';
    }
  }
  
  // Then extract bits from unit structure
  for (let i = 0; i < contentUnits.length && extractedBits.length < 64; i++) {
    const analysis = analyzeContentUnit(contentUnits[i]);
    
    // Extract from point of view
    if (analysis.pov === 'first') {
      extractedBits += '0';
    } else if (analysis.pov === 'third') {
      extractedBits += '1';
    } else {
      // Extract from rhetorical structure
      if (analysis.rhetorical.includes(RhetoricalPattern.EndingQuestion)) {
        extractedBits += '0';
      } else if (analysis.rhetorical.includes(RhetoricalPattern.EndingEmphasis)) {
        extractedBits += '1';
      } else {
        // Extract from tense
        if (analysis.tense === 'past') {
          extractedBits += '0';
        } else if (analysis.tense === 'future') {
          extractedBits += '1';
        } else {
          // If we can't determine, use dialectic
          if (analysis.dialectic === 'narrative') {
            extractedBits += '0';
          } else if (analysis.dialectic === 'argumentative') {
            extractedBits += '1';
          } else {
            // As a last resort, use complexity
            extractedBits += analysis.complexity < 12 ? '0' : '1';
          }
        }
      }
    }
  }
  
  // Check if we have at least 16 bits for the length
  if (extractedBits.length < 16) {
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
 * Demonstration function to show structural encoding in action
 * @param originalText Sample text to encode
 * @param dataToHide Data to hide within the text
 */
export const demonstrateStructuralEncoding = (originalText: string, dataToHide: string): void => {
  console.log("=== STRUCTURAL STEGANOGRAPHY DEMONSTRATION ===\n");
  console.log("Original text:");
  console.log("-".repeat(50));
  console.log(originalText);
  console.log("-".repeat(50) + "\n");
  
  console.log("Data to hide:", dataToHide);
  console.log("Data length:", dataToHide.length, "characters");
  console.log();
  
  try {
    console.log("Encoding data structurally...");
    const encodedText = hideDataStructurally(originalText, dataToHide);
    
    console.log("\nStructurally encoded text:");
    console.log("-".repeat(50));
    console.log(encodedText);
    console.log("-".repeat(50) + "\n");
    
    console.log("Original length:", originalText.length, "characters");
    console.log("Encoded length:", encodedText.length, "characters");
    console.log("Difference:", encodedText.length - originalText.length, "characters\n");
    
    console.log("Attempting to extract hidden data...");
    const extractedData = extractHiddenStructuralData(encodedText);
    
    console.log("\nExtracted data:", extractedData);
    console.log("Original data:", dataToHide);
    console.log("Match:", extractedData === dataToHide ? "✓" : "✗");
    
    if (extractedData !== dataToHide) {
      console.log("\nWARNING: Extracted data doesn't match original.");
      console.log("This could be due to insufficient content structure for reliable encoding.");
    }
  } catch (error) {
    console.error("Error during demonstration:", error);
  }
};

// Auto-run demonstration if this file is executed directly
if (require.main === module) {
  const sampleText = `
The development of resilient encoding systems represents a fascinating intersection
of linguistics, information theory, and cryptography. These systems must account for
various transformations that content might undergo, from digital transcoding to
translation between languages.

When we consider the preservation of metadata across these transformations, we
must move beyond character-level approaches. Surface-level features are easily
lost. Instead, we should focus on deep structural patterns that maintain their
integrity across transformations.

High-order linguistic features such as narrative viewpoint, rhetorical structure,
and dialectic patterns offer promising avenues. These features typically survive
translation and transformation because they represent fundamental aspects of
how information is organized and presented.

Researchers have explored various methods for embedding data in these higher-order
structures. The challenge lies in balancing encoding capacity with naturalness.
Too aggressive an approach results in awkward or artificial text, while too subtle
an approach risks losing the encoded data.

The approach described here represents one possible solution to this challenge.
By distributing encoded bits across multiple structural levels, we create redundancy
that increases the likelihood of successful extraction even after significant
transformation of the content.
`;

  const dataToHide = "This is a demonstration of structural steganography that can survive content transformations.";
  
  demonstrateStructuralEncoding(sampleText, dataToHide);
}