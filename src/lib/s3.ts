import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";


export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new S3({
        region: "us-east-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });

      const file_key =
        "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

      console.log(`Starting upload to S3 for file: ${file.name}`);

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      };
      s3.putObject(
        params,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          if (err) {
            console.error('Error uploading to S3:', err);
            reject(err);
          } else {
            console.log(`Successfully uploaded ${file.name} to S3 with key ${file_key}`);
            resolve({
              file_key,
              file_name: file.name,
            });
          }
        }
      );
    } catch (error) {
      console.error('Error in uploadToS3 function:', error);
      reject(error);
    }
  });
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${file_key}`;
  return url;
}
