import test from 'node:test';
import assert from 'node:assert/strict';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { uploadMetadata, validSignature } from '../lib/uploads';
test('upload metadata rejects oversized files and active content',()=>{
  assert.equal(uploadMetadata('guide.PDF',50_000_000).type,'application/pdf');
  for(const [name,size] of [['bad.html',10],['guide.pdf',50_000_001],['guide.pdf',0],['guide.pdf',1.5]] as const)
    assert.throws(()=>uploadMetadata(name,size));
});
test('file signatures must match their extensions',()=>{
  assert.ok(validSignature('pdf',Buffer.from('%PDF-1.7')));
  assert.ok(validSignature('png',Buffer.from('89504e470d0a1a0a','hex')));
  assert.ok(!validSignature('pdf',Buffer.from('<html>')));
  assert.ok(!validSignature('txt',Buffer.from([65,0,66])));
});
test('signed uploads bind both content type and content length',async()=>{
  const client=new S3Client({region:'auto',endpoint:'https://example.r2.cloudflarestorage.com',credentials:{accessKeyId:'test',secretAccessKey:'test'},requestChecksumCalculation:'WHEN_REQUIRED'});
  const url=new URL(await getSignedUrl(client,new PutObjectCommand({Bucket:'resources',Key:'test.pdf',ContentLength:100,ContentType:'application/pdf'}),{expiresIn:600,signableHeaders:new Set(['content-type','content-length'])}));
  assert.match(url.searchParams.get('X-Amz-SignedHeaders') || '',/content-length/);
  assert.match(url.searchParams.get('X-Amz-SignedHeaders') || '',/content-type/);
});
