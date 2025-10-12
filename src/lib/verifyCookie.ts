function urlSafeToBinary(str: string) {
  const t = str.replaceAll('-', '+').replaceAll('_', '/');
  const pad = '='.repeat((4 - (t.length % 4)) % 4);
  return atob(t + pad);
}

export async function verifySignedCookie(value: string) {
  const [payloadB64, sigB64] = value.split('.');
  if (!payloadB64 || !sigB64) return null;

  const payload = atob(payloadB64);
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(process.env.COOKIE_SECRET!),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const ok = await crypto.subtle.verify(
    'HMAC',
    key,
    new Uint8Array([...urlSafeToBinary(sigB64)].map((c) => c.charCodeAt(0))),
    enc.encode(payload)
  );
  if (!ok) return null;
  return JSON.parse(payload); // { id, iat }
}
