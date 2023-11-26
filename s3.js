// config
import dotenv from "dotenv";
dotenv.config();
const { S3_KEY, S3_SECRET, S3_BUCKET, S3_PATH } = process.env;

// imports
import { PassThrough } from "node:stream";
import { Upload } from "@aws-sdk/lib-storage";
import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

export function getFilePath(name) {
  return `https://${S3_BUCKET}.${S3_PATH}/${name}`;
}

// a client can be shared by different commands.
const client = new S3Client({
  endpoint: `https://${S3_PATH}`,
  credentials: {
    accessKeyId: S3_KEY,
    secretAccessKey: S3_SECRET,
  },
  region: "us-east-005",
});

const command = new ListBucketsCommand({});

// async/await.
try {
  const data = await client.send(command);
  //   console.log("ok", data);
  // process data.
} catch (error) {
  console.log("err", error);
  // error handling.
} finally {
  // finally.
}

export function uploadFile(panoramaFile) {
  console.log(panoramaFile);
  console.log("1");
  const pass = new PassThrough();
  console.log("2");
  const parallelUploads3 = new Upload({
    client: client,
    params: {
      Bucket: S3_BUCKET,
      Key: S3_BUCKET,
      Body: pass,
    },
  });

  parallelUploads3.on("httpUploadProgress", (progress) => {
    console.log("progress", progress);
  });
  parallelUploads3.done();

  return pass;
}
