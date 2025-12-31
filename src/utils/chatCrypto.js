/**
 * Production-grade chat encryption using Web Crypto API (AES-256-GCM)
 * Compatible with Supabase storage
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SALT = "supabase-secure-chat-v1";

/**
 * 🔑 Generate deterministic crypto key for a chat
 * Same key will be generated for both users
 */
export async function getChatKey(userId, friendId) {
  if (!userId || !friendId) {
    throw new Error("Invalid user IDs for chat key");
  }

  const baseKey = [userId, friendId].sort().join(":");

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(baseKey),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(SALT),
      iterations: 150000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * 🔐 Encrypt plain text message
 * Returns JSON-safe object for Supabase (jsonb)
 */
export async function encryptText(plainText, cryptoKey) {
  if (!plainText || !cryptoKey) return null;

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encoder.encode(plainText)
  );

  return {
    iv: Array.from(iv),
    content: Array.from(new Uint8Array(encryptedBuffer)),
  };
}

/**
 * 🔓 Decrypt encrypted message object
 */
export async function decryptText(encryptedData, cryptoKey) {
  if (!encryptedData || !cryptoKey) return "";

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(encryptedData.iv),
      },
      cryptoKey,
      new Uint8Array(encryptedData.content)
    );

    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("❌ Decryption failed", error);
    return "";
  }
}
