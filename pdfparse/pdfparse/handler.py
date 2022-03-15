import json


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
    body = {
        "message": "pdf confidentialized",
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response