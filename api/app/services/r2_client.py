import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from app.core.config import settings

s3_client = boto3.client(
    's3',
    endpoint_url=settings.R2_ENDPOINT_URL,
    aws_access_key_id=settings.R2_ACCESS_KEY_ID,
    aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
    config=Config(signature_version='s3v4'),
    region_name='auto' # Quan trọng cho R2
)

def create_presigned_upload_url(bucket_name: str, object_name: str, expiration=3600):
    """Tạo một URL đã ký trước để upload file lên R2/S3"""
    try:
        response = s3_client.generate_presigned_post(
            Bucket=bucket_name,
            Key=object_name,
            ExpiresIn=expiration
        )
        return response
    except ClientError as e:
        print(f"Error creating presigned URL: {e}")
        return None