function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function pipeBytes(
  bytes: Uint8Array,
  transform: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
  const stream = new Blob([bytes]).stream().pipeThrough(transform);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function encodeCompressedJson(value: unknown): Promise<string> {
  const compressed = await pipeBytes(
    new TextEncoder().encode(JSON.stringify(value)),
    new CompressionStream("deflate-raw"),
  );
  return bytesToBase64Url(compressed);
}

export async function decodeCompressedJson(encoded: string): Promise<unknown> {
  const bytes = await pipeBytes(
    base64UrlToBytes(encoded),
    new DecompressionStream("deflate-raw"),
  );
  return JSON.parse(new TextDecoder().decode(bytes));
}
