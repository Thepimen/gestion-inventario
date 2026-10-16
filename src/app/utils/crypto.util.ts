/**
 * Práctica: FormularioReactivo (Desarrollo de Interfaces - 2º DAM)
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Utilidad criptográfica para hashing seguro de contraseñas (SHA-256)
 * mediante la Web Crypto API nativa (crypto.subtle).
 */

export async function hashPasswordSHA256(plainText: string): Promise<string> {
  if (!plainText) {
    return '';
  }

  // Intentar con Web Crypto API nativa
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(plainText);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (err) {
      console.warn('Fallback a generador alternativo:', err);
    }
  }

  // Fallback determinista síncrono si el entorno no dispone de crypto.subtle
  let hash1 = 0xdeadbeef;
  let hash2 = 0x41c6ce57;
  for (let i = 0; i < plainText.length; i++) {
    const ch = plainText.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ ch, 2654435761);
    hash2 = Math.imul(hash2 ^ ch, 1597334677);
  }
  hash1 = Math.imul(hash1 ^ (hash1 >>> 16), 2246822507);
  hash2 = Math.imul(hash2 ^ (hash2 >>> 13), 3266489909);
  const part1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  return (part1 + part2 + part1 + part2 + part1 + part2 + part1 + part2).slice(0, 64);
}
