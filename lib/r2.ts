import { S3Client } from '@aws-sdk/client-s3';
export function r2Config() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL)
    throw new Error('Resource storage is not configured yet.');
  const publicUrl = new URL(R2_PUBLIC_URL);
  if (publicUrl.protocol !== 'https:') throw new Error('Resource storage requires HTTPS.');
  return {
    bucket: R2_BUCKET,
    publicUrl: publicUrl.origin,
    client: new S3Client({
      region: 'auto', endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
      requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED',
    }),
  };
}
