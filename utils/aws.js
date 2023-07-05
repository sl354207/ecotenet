import { S3 } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { promisify } from "util";

const { AWS_ID, AWS_KEY } = process.env;

const region = "us-east-2";
const bucketName = "eco-media-bucket";
const accessKeyId = AWS_ID;
const secretAccessKey = AWS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const randomBytes = promisify(crypto.randomBytes);

export async function generateUploadURL(name, postId, type) {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");
  const ext = type.substring(type.indexOf("/") + 1);
  const file = `${name}/${postId}/${imageName}.${ext}`;

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
    throw new Error(error);
  }
}
export async function generateDeleteURL(name, postId, key) {
  const file = `${name}/${postId}/${key}`;
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
    throw new Error(error);
  }
}

export async function deleteDirectoryPromise(path) {
  try {
    const prefixes = await getDirectoryPrefixes(path);

    if (prefixes.length > 0) {
      const deleteParams = {
        Bucket: bucketName,
        Delete: { Objects: prefixes },
      };

      return s3.deleteObjects(deleteParams);
    }
    return s3
      .deleteObject({
        Bucket: bucketName,
        Key: path,
      });
  } catch (error) {
    throw new Error(error);
  }
}

async function getDirectoryPrefixes(path) {
  const prefixes = [];
  const promises = [];
  const listParams = {
    Bucket: bucketName,
    Prefix: path,
    Delimiter: "/",
  };
  try {
    const listedObjects = await s3.listObjectsV2(listParams);

    if (
      listedObjects.Contents.length > 0 ||
      listedObjects.CommonPrefixes.length > 0
    ) {
      listedObjects.Contents.forEach(({ Key }) => {
        prefixes.push({ Key });
      });

      listedObjects.CommonPrefixes.forEach(({ Prefix }) => {
        prefixes.push({ Key: Prefix });
        promises.push(getDirectoryPrefixes(Prefix));
      });
      // if (listedObjects.IsTruncated) await this.deleteDirectoryPromise(path);
    }
    const subPrefixes = await Promise.all(promises);
    subPrefixes.map((arrPrefixes) => {
      arrPrefixes.map((prefix) => {
        prefixes.push(prefix);
      });
    });
    return prefixes;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteRecursive(path) {
  let count = 0;
  while (true) {
    try {
      // list objects
      const listedObjects = await s3
        .listObjectsV2({
          Bucket: bucketName,
          Prefix: path,
        });
      if (listedObjects.Contents === undefined) {
        throw new Error("Listing S3 returns no contents");
      }
      if (listedObjects.Contents.length !== 0) {
        // prepare delete request
        const deleteParams = {
          Bucket: bucketName,
          Delete: {
            Objects: listedObjects.Contents.map((obj) => ({
              Key: obj.Key,
            })),
          },
        };
        // listedObjects.Contents.forEach(({ Key }) => {
        //     deleteParams.Delete.Objects.push({ Key as string });
        // });
        const deleteOutput = await s3.deleteObjects(deleteParams);
        // count or list
        count += deleteOutput.Deleted.length;
      }
      if (!listedObjects.IsTruncated) {
        return count;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
