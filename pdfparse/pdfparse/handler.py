import json
import logging
import urllib.parse
import boto3
from .getPdfText import parse_pages

s3 = boto3.client('s3')

def hello(event, context):
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response


# TODO: receive the s3 event -> download PDF -> confidentialize -> save on another bucket
def parse_pdf(event, context):
    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(
            record['s3']['object']['key'], encoding='utf-8')
        try:
            logging.info("downloading object: {} | bucket: {}", key, bucket_name)
            input_file = '/tmp/' + key
            s3.download_file(bucket_name, key, input_file)

            logging.info("parsing object: {} | bucket: {}", key, bucket_name)
            output_file = '/tmp/output_'+key
            parse_pages(input_file, output_file)

            logging.info("uploading object: {} | bucket: {}", key, bucket_name)
            response = s3.upload_file(output_file, bucket_name, key)
            logging.info("processing finished! object: {} | bucket: {}", key, bucket_name)
            logging.info("response: {} | object: {} | bucket: {}", response, key, bucket_name)
        except Exception as e:
            # TODO: put data on a queue to reprocess this when the system has stabilized
            logging.error(e)

    return True
