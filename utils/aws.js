import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { promisify } from "util";

const { AWS_ID, AWS_KEY } = process.env;

const region = "us-east-2";
const bucketName = "eco-media-bucket";
const accessKeyId = AWS_ID;
const secretAccessKey = AWS_KEY;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    signatureVersion: "v4",
  },
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
  };

  const command = new PutObjectCommand(params);

  try {
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
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
  };

  const command = new DeleteObjectCommand(params);

  try {
    const deleteURL = await getSignedUrl(s3, command, { expiresIn: 60 });
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
      const command = new DeleteObjectsCommand(deleteParams);
      const deletedObjects = await s3.send(command);

      return deletedObjects;
    }
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: path,
    });

    const deletedObject = await s3.send(command);
    return deletedObject;
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
  const command = new ListObjectsV2Command(listParams);
  try {
    const listedObjects = await s3.send(command);
    // console.log(listedObjects);

    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      listedObjects.Contents.forEach(({ Key }) => {
        prefixes.push({ Key });
      });
    }
    if (
      listedObjects.CommonPrefixes &&
      listedObjects.CommonPrefixes.length > 0
    ) {
      listedObjects.CommonPrefixes.forEach(({ Prefix }) => {
        prefixes.push({ Key: Prefix });
        promises.push(getDirectoryPrefixes(Prefix));
      });
    }
    // if (listedObjects.IsTruncated) await this.deleteDirectoryPromise(path);

    const subPrefixes = await Promise.all(promises);
    subPrefixes.map((arrPrefixes) => {
      arrPrefixes.map((prefix) => {
        prefixes.push(prefix);
      });
    });
    // console.log(prefixes);
    return prefixes;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteRecursive(path) {
  let count = 0;
  const listParams = {
    Bucket: bucketName,
    Prefix: path,
  };
  const command = new ListObjectsV2Command(listParams);

  while (true) {
    try {
      // list objects
      const listedObjects = await s3.send(command);
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
        const command = new DeleteObjectsCommand(deleteParams);
        const deletedOutput = await s3.send(command);
        // count or list
        count += deletedOutput.Deleted.length;
      }
      if (!listedObjects.IsTruncated) {
        return count;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
