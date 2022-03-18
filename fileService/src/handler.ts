import { uploadServiceFactory } from "./uploadService";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
const uploadService = uploadServiceFactory(process.env.AWS_REGION);

export const putPdfUrl = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const fileName = uuid();
  const filePath = `public/${fileName}.pdf`;
  const contentType = "application/pdf";
  const signedPayload = await uploadService.getSignedUploadURL(
    process.env.CV_INPUT_BUCKET_NAME,
    filePath,
    contentType
  );
  const responsePayload = { ...signedPayload, fileName };
  return {
    statusCode: 200,
    body: JSON.stringify(responsePayload),
  };
};

export const getConfidentialPdfUrl = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: use url params
  const fileName = event.queryStringParameters.file;
  const filePath = `public/${fileName}.pdf`;
  const contentType = "application/pdf";
  const signedPayload = await uploadService.getSignedDownloadURL(
    process.env.CONFIDENTIAL_BUCKET_NAME,
    filePath,
    contentType
  );
  return {
    statusCode: 200,
    body: JSON.stringify(signedPayload),
  };
};
