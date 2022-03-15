import { uploadServiceFactory } from './uploadService.js'
const uploadService = uploadServiceFactory(process.env.AWS_REGION)

export async function putPdfUrl(event) {
  const filePath = `public/${uuid()}.pdf`
  const contentType = 'application/pdf'
  const signedPayload = await uploadService.getSignedUploadURL(
    process.env.CV_INPUT_BUCKET, filePath, contentType)
  return {
    statusCode: 200,
    body: JSON.stringify(signedPayload)
  }
}

/**
 * 
 * @param {*} event Http Event from AWS
 * @returns 
 */
export async function getConfidentialPdfUrl(event) {
  // TODO: use url params
  const body = JSON.parse(event.body)
  const filePath = `public/${body.url}.pdf`
  const contentType = 'application/pdf'
  const signedPayload = await uploadService.getSignedDownloadURL(
    process.env.CONFIDENTIAL_BUCKET, filePath, contentType)
  return {
    statusCode: 200,
    body: JSON.stringify(signedPayload)
  }
}
