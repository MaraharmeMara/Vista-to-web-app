// config
import dotenv from "dotenv";
dotenv.config();
const { S3_KEY, S3_SECRET, S3_BUCKET, S3_PATH } = process.env;

// imports
import { PassThrough } from "node:stream";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
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

// export function uploadFile(fileName) {
//     return (panoramaFile) => {

//     }
// }

export function uploadFile(panoramaFile) {
  panoramaFile.uuid = uuidv4();
  //   console.log(panoramaFile);

  const pass = new PassThrough();
  const parallelUploads3 = new Upload({
    client: client,
    params: {
      Bucket: S3_BUCKET,
      Key: panoramaFile.uuid,
      Body: pass,
      ContentType: "image/jpeg",
    },
  });

  //   parallelUploads3.on("httpUploadProgress", (progress) => {
  //     console.log("progress", progress);
  //   });
  parallelUploads3.done();

  return pass;
}
