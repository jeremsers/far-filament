import type { APIRoute } from 'astro';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
export const prerender = false;

// 1. Initialisation du client R2 (via l'API S3)
const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.R2_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY,
  },
});

export const GET: APIRoute = async ({ params, request }) => {
  const filename = params.filename;

  if (!filename) {
    return new Response('Fichier introuvable', { status: 404 });
  }

  try {
    // 2. Préparation de la requête pour récupérer le fichier
    const command = new GetObjectCommand({
      Bucket: import.meta.env.R2_BUCKET_NAME,
      Key: filename,
      ResponseContentDisposition: `attachment; filename="${filename}"`
    });


    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
    
    return Response.redirect(signedUrl, 302);

  } catch (error) {
    console.error('Erreur R2:', error);
    return new Response('Erreur serveur lors de la récupération du fichier', { status: 500 });
  }
};