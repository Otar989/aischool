import crypto from "node:crypto"

export function verifyYooKassaSignature(
  body: string,
  signature: string,
  secret: string,
): boolean {
  const hmac = crypto.createHmac("sha1", secret).update(body).digest("base64")
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))
  } catch {
    return false
  }
}
