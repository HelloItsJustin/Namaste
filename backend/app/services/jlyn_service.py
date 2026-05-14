import string
import secrets
import random
import hashlib
from typing import Dict, Any

class JlynCipher:
    """
    Jlyn* Star Algorithm - Pluggable Encryption Module
    Adapted for NAMASTE Backend Vault Storage
    """
    def __init__(self):
        self.all_chars = ''.join(sorted(set(string.printable)))
        self.char_len = len(self.all_chars)
        self.char_to_index = {c: i for i, c in enumerate(self.all_chars)}
        self.index_to_char = {i: c for i, c in enumerate(self.all_chars)}

    def _mulberry32(self, seed: int):
        def rng():
            nonlocal seed
            seed = (seed + 0x6D2B79F5) & 0xFFFFFFFF
            t = ((seed ^ (seed >> 15)) * (1 | seed)) & 0xFFFFFFFF
            t = (t + ((t ^ (t >> 7)) * (61 | t)) ^ t) & 0xFFFFFFFF
            return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
        return rng

    def _generate_star_map(self, key: bytes) -> list:
        """Generate deterministic star mapping based on key using mulberry32"""
        seed = 0
        for i, byte in enumerate(key):
            seed ^= byte << (8 * (i % 4))
        
        rng = self._mulberry32(seed)
        indexes = list(range(self.char_len))
        
        # Fisher-Yates shuffle
        for i in range(len(indexes) - 1, 0, -1):
            j = int(rng() * (i + 1))
            indexes[i], indexes[j] = indexes[j], indexes[i]
        return indexes

    def encrypt(self, plaintext: str, key: bytes = None) -> Dict[str, str]:
        """Encrypt plaintext using Jlyn* Algorithm"""
        if key is None:
            key = secrets.token_bytes(32)
        
        star_map = self._generate_star_map(key)
        char_to_star = {self.index_to_char[i]: self.index_to_char[star_map[i]] for i in range(self.char_len)}
        encrypted_chars = [char_to_star.get(ch, ch) for ch in plaintext]
        encrypted = ''.join(encrypted_chars)
        
        return {
            "key": key.hex(),
            "ciphertext": encrypted
        }

    def decrypt(self, encrypted_data: Dict[str, str]) -> str:
        """Decrypt ciphertext using Jlyn* Algorithm"""
        key = bytes.fromhex(encrypted_data["key"])
        ciphertext = encrypted_data["ciphertext"]
        
        star_map = self._generate_star_map(key)
        star_to_char = {self.index_to_char[star_map[i]]: self.index_to_char[i] for i in range(self.char_len)}
        decrypted_chars = [star_to_char.get(ch, ch) for ch in ciphertext]
        decrypted = ''.join(decrypted_chars)
        
        return decrypted

    @staticmethod
    def hash_sha256(data: str) -> str:
        """Hash data using SHA-256 for IPFS content addressing"""
        return hashlib.sha256(data.encode()).hexdigest()

# Singleton instance
jlyn_cipher = JlynCipher()
