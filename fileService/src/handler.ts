import { uploadServiceFactory } from "./uploadService";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
const uploadService = uploadServiceFactory(process.env.AWS_REGION);

export const putPdfUrl = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const filePath = `public/${uuid()}.pdf`;
  const contentType = "application/pdf";
  const signedPayload = await uploadService.getSignedUploadURL(
    process.env.CV_INPUT_BUCKET,
    filePath,
    contentType
  );
  return {
    statusCode: 200,
    body: JSON.stringify(signedPayload),
  };
};

export const getConfidentialPdfUrl = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: use url params
  const body = JSON.parse(event.body);
  const filePath = `public/${body.url}.pdf`;
  const contentType = "application/pdf";
  const signedPayload = await uploadService.getSignedDownloadURL(
    process.env.CONFIDENTIAL_BUCKET,
    filePath,
    contentType
  );
  return {
    statusCode: 200,
    body: JSON.stringify(signedPayload),
  };
};
