import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "util";

const { AWS_ID, AWS_KEY } = process.env;

const region = "us-east-2";
const bucketName = "eco-media-bucket";
const accessKeyId = AWS_ID;
const secretAccessKey = AWS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const randomBytes = promisify(crypto.randomBytes);

export async function generateUploadURL(name, id, type) {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");
  const ext = type.substring(type.indexOf("/") + 1);
  const file = `${name}/${id}/${imageName}.${ext}`;

  const params = {
    Bucket: bucketName,
    Key: file,
    Expires: 60,
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    return JSON.stringify(uploadURL);
  } catch (error) {
    console.error(error);
  }
}
export async function generateDeleteURL(name, id, key) {
  const file = `${name}/${id}/${key}`;
  const params = {
    Bucket: bucketName,
    Key: file,
    Expires: 60,
  };

  try {
    const deleteURL = await s3.getSignedUrlPromise("deleteObject", params);
    return JSON.stringify(deleteURL);
  } catch (error) {
    console.error(error);
  }
}
