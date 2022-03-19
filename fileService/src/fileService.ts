// Reference: https://aws.amazon.com/pt/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/
"use strict";
export const fileServiceFactory = (region: string) => {
  const AWS = require("aws-sdk");
  AWS.config.update({ region: region });
  const s3 = new AWS.S3();

  // Change this value to adjust the signed URL's expiration
  const URL_EXPIRATION_SECONDS = 300;

  /**
   * Get a signed URL with timeout for the users to be able to upload and retrieve data from the bucket.
   * @param {string} bucket The bucket where the operation is desired.
   * @param {string} filePath The bucket file path to the user to get info.
   * @param {string} contentType The content type of the file that the user is uploading.
   * @param {boolean} shouldUpload Defines if the link is for uploading or retrieving data.
   * @returns {Promise<{uploadURL: string, path: string}>}
   */
  const getSignedURL = async function (
    bucket: string,
    filePath: string,
    contentType: string,
    shouldUpload: boolean
  ): Promise<{ uploadURL: string; path: string }> {
    const Key = filePath;

    // Get signed URL from S3
    const s3Params: any = {
      Bucket: bucket,
      Key,
      Expires: URL_EXPIRATION_SECONDS,
    };

    if (shouldUpload) {
      s3Params.ContentType = contentType;
    }

    console.log("Params: ", s3Params);
    const action = shouldUpload ? "putObject" : "getObject";
    const uploadURL = await s3.getSignedUrlPromise(action, s3Params);

    return {
      uploadURL: uploadURL,
      path: Key,
    };
  };

  const getSignedUploadURL = async function (
    bucket: string,
    filePath: string,
    contentType: string
  ): Promise<{ uploadURL: string; path: string }> {
    return getSignedURL(bucket, filePath, contentType, true);
  };

  const getSignedDownloadURL = async function (
    bucket: string,
    filePath: string
  ) {
    return getSignedURL(bucket, filePath, null, false);
  };

  const checkFileExists = async function (
    bucket: string,
    filePath: string
  ): Promise<boolean> {
    const s3Params: any = {
      Bucket: bucket,
      Key: filePath,
    };
    try {
      const headResult = await s3.headObject(s3Params).promise();
      console.log(`head-result: ${headResult}`);
    } catch (error) {
      return false;
    }
    return true;
  };

  return {
    getSignedUploadURL,
    getSignedDownloadURL,
    checkFileExists,
  };
};
