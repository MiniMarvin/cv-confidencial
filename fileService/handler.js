import { uploadServiceFactory } from './uploadService.js'
const uploadService = uploadServiceFactory(process.env.AWS_REGION)

export async function putAudioAuth(event) {
  const filePath = `public/${uuid()}.pdf`
  const contentType = 'application/pdf'
  const signedPayload = await uploadService.getSignedURL(
    process.env.AUDIOS_BUCKET, filePath, contentType)
  return {
    statusCode: 200,
    body: JSON.stringify(signedPayload)
  }
}
