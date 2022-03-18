import json
import logging
import urllib.parse
import boto3
from getPdfText import parse_pages
import os

s3 = boto3.client('s3')
logging.getLogger().setLevel(logging.INFO)

# TODO: receive the s3 event -> download PDF -> confidentialize -> save on another bucket
def pdf_parse(event, context):
    logging.info(event)
    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(
            record['s3']['object']['key'], encoding='utf-8')
        file_name = key.split('/')[-1]
        try:
            logging.info(f"downloading object: {key} | bucket: {bucket_name}")
            input_file = '/tmp/' + file_name
            s3.download_file(bucket_name, key, input_file)

            logging.info(f"parsing object: {key} | bucket: {bucket_name}")
            output_file = '/tmp/output_'+file_name
            parse_pages(input_file, output_file)

            output_bucket_name = os.environ['CONFIDENTIAL_BUCKET_NAME']
            logging.info(f"uploading object: {key} | bucket: {output_bucket_name}")
            response = s3.upload_file(output_file, output_bucket_name, key)
            logging.info(f"processing finished! object: {key} | bucket: {output_bucket_name}")
            logging.info(f"response: {response} | object: {key} | bucket: {output_bucket_name}")
        except Exception as e:
            # TODO: put data on a queue to reprocess this when the system has stabilized
            logging.error(e)

    return True
