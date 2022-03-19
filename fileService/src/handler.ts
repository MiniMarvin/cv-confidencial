import { fileServiceFactory } from "./fileService";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
const fileService = fileServiceFactory(process.env.AWS_REGION);

export const putPdfUrl = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const fileName = uuid();
  const filePath = `public/${fileName}.pdf`;
  const contentType = "application/pdf";
  const signedPayload = await fileService.getSignedUploadURL(
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
  const fileName = event.queryStringParameters.file;
  const filePath = `public/${fileName}.pdf`;
  const fileExists = await fileService.checkFileExists(
    process.env.CONFIDENTIAL_BUCKET_NAME,
    filePath
  );
  if (!fileExists) {
    return {
      statusCode: 404,
      body: null,
    };
  } else {
    const signedPayload = await fileService.getSignedDownloadURL(
      process.env.CONFIDENTIAL_BUCKET_NAME,
      filePath
    );
    return {
      statusCode: 200,
      body: JSON.stringify(signedPayload),
    };
  }
};
