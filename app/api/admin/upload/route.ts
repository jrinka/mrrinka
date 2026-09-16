import { randomUUID } from 'node:crypto';
import { PutObjectCommand, HeadObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { authorizedSession, sameOrigin, seal, unseal } from '@/lib/auth';
import { r2Config } from '@/lib/r2';
import { uploadMetadata, validSignature } from '@/lib/uploads';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({error:'Invalid request origin.'},{status:403});
  const auth = await authorizedSession();
  if (!auth) return Response.json({error:'Please sign in again.'},{status:401});
  if (Number(request.headers.get('content-length')) > 10000)
    return Response.json({error:'Upload request is too large.'},{status:413});
  try {
    const body = await request.json();
    const { client, bucket, publicUrl } = r2Config();
    if (body.action === 'complete') {
      const ticket = await unseal(String(body.ticket), 'upload');
      if (ticket.user !== auth.id || typeof ticket.key !== 'string' ||
          !/^resources\/[0-9a-f-]{36}\.(pdf|png|jpg|jpeg|webp|txt)$/.test(ticket.key))
        return Response.json({error:'Invalid upload confirmation.'},{status:400});
      const Key = ticket.key;
      const head = await client.send(new HeadObjectCommand({Bucket:bucket,Key}));
      const sample = await client.send(new GetObjectCommand({Bucket:bucket,Key,Range:'bytes=0-4095'}));
      const bytes = await sample.Body?.transformToByteArray();
      if (head.ContentLength !== ticket.size || head.ContentType !== ticket.type ||
          !bytes || !validSignature(String(ticket.ext),bytes)) {
        await client.send(new DeleteObjectCommand({Bucket:bucket,Key}));
        return Response.json({error:'The uploaded file did not match its size or file type.'},{status:400});
      }
      return Response.json({url:`${publicUrl}/${Key}`});
    }
    if (body.action !== 'start' || typeof body.name !== 'string' || body.name.length > 240)
      return Response.json({error:'Invalid upload request.'},{status:400});
    const meta = uploadMetadata(body.name,body.size);
    const Key = `resources/${randomUUID()}.${meta.ext}`;
    const command = new PutObjectCommand({Bucket:bucket,Key,ContentType:meta.type,
      ContentLength:meta.size});
    const uploadUrl = await getSignedUrl(client,command,{expiresIn:600,signableHeaders:new Set(['content-type','content-length'])});
    const ticket = await seal({user:auth.id,key:Key,...meta},'upload',900);
    return Response.json({uploadUrl,ticket,type:meta.type});
  } catch {
    return Response.json({error:'Upload could not be completed. Check the file type and size, then try again.'},{status:400});
  }
}
