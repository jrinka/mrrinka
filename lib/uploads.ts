export const maxUploadBytes = 50_000_000;
export const uploadTypes: Record<string, string> = {
  pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg',
  jpeg: 'image/jpeg', webp: 'image/webp', txt: 'text/plain',
};
export function uploadMetadata(name: string, size: number) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (!uploadTypes[ext] || !Number.isSafeInteger(size) || size < 1 || size > maxUploadBytes)
    throw new Error('Choose a PDF, PNG, JPG, WebP, or text file up to 50 MB.');
  return { ext, type: uploadTypes[ext], size };
}
export function validSignature(ext: string, bytes: Uint8Array) {
  const b = Buffer.from(bytes);
  return (ext === 'pdf' && b.subarray(0,5).toString() === '%PDF-') ||
    (ext === 'png' && b.subarray(0,8).toString('hex') === '89504e470d0a1a0a') ||
    (['jpg','jpeg'].includes(ext) && b.subarray(0,3).toString('hex') === 'ffd8ff') ||
    (ext === 'webp' && b.subarray(0,4).toString() === 'RIFF' && b.subarray(8,12).toString() === 'WEBP') ||
    (ext === 'txt' && !b.includes(0));
}
