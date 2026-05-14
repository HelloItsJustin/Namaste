/**
 * NAMASTE — Jlyn Cipher Module (TypeScript)
 * Adapted from JlynStarAlgo.py — pluggable encryption for vault data
 * Used before IPFS upload and for credential storage
 */

const ALL_CHARS = Array.from(
  new Set(
    '\t\n\r !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
  )
).sort().join('');

const CHAR_LEN = ALL_CHARS.length;

// Seeded deterministic shuffle (Mulberry32 PRNG)
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function generateStarMap(keyBytes: Uint8Array): number[] {
  // XOR all bytes of the key to incorporate all entropy into a 32-bit seed
  let seed = 0;
  for (let i = 0; i < keyBytes.length; i++) {
    seed ^= keyBytes[i] << (8 * (i % 4));
  }
  const rng = mulberry32(seed);
  const indexes = Array.from({ length: CHAR_LEN }, (_, i) => i);
  // Fisher-Yates shuffle with seeded RNG
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface JlynEncryptedData {
  key: string;       // hex-encoded key
  ciphertext: string;
}

/**
 * Encrypt plaintext using Jlyn* Star Algorithm
 */
export function jlynEncrypt(plaintext: string, keyHex?: string): JlynEncryptedData {
  let keyBytes: Uint8Array;

  if (keyHex) {
    keyBytes = hexToBytes(keyHex);
  } else {
    keyBytes = crypto.getRandomValues(new Uint8Array(32));
  }

  const starMap = generateStarMap(keyBytes);
  // Build char→star mapping
  const charToStar: Record<string, string> = {};
  for (let i = 0; i < CHAR_LEN; i++) {
    charToStar[ALL_CHARS[i]] = ALL_CHARS[starMap[i]];
  }

  const encrypted = Array.from(plaintext)
    .map(ch => charToStar[ch] ?? ch)
    .join('');

  return { key: bytesToHex(keyBytes), ciphertext: encrypted };
}

/**
 * Decrypt ciphertext using Jlyn* Star Algorithm
 */
export function jlynDecrypt(data: JlynEncryptedData): string {
  const keyBytes = hexToBytes(data.key);
  const starMap = generateStarMap(keyBytes);

  // Build star→char mapping (inverse)
  const starToChar: Record<string, string> = {};
  for (let i = 0; i < CHAR_LEN; i++) {
    starToChar[ALL_CHARS[starMap[i]]] = ALL_CHARS[i];
  }

  return Array.from(data.ciphertext)
    .map(ch => starToChar[ch] ?? ch)
    .join('');
}

/**
 * Encrypt a JSON object for vault/IPFS storage
 */
export function jlynEncryptObject(obj: object, keyHex?: string): JlynEncryptedData {
  return jlynEncrypt(JSON.stringify(obj), keyHex);
}

/**
 * Decrypt a vault-stored JSON object
 */
export function jlynDecryptObject<T = unknown>(data: JlynEncryptedData): T {
  return JSON.parse(jlynDecrypt(data)) as T;
}

/**
 * Hash a string using SHA-256 (for IPFS content addressing)
 */
export async function sha256(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return bytesToHex(new Uint8Array(hashBuffer));
}

/**
 * Truncate a hex address/hash for display
 */
export function truncateHash(hash: string, chars = 8): string {
  if (!hash || hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}
