import dotenv from "dotenv";
dotenv.config();
const { S3_KEY, S3_SECRET } = process.env;

// ES6+ example
import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

// a client can be shared by different commands.
const client = new S3Client({
  endpoint: "https://s3.filebase.com",
  credentials: {
    accessKeyId: S3_KEY,
    secretAccessKey: S3_SECRET,
  },
  region: "us-east-1",
});

const params = {
  /** input parameters */
};
const command = new ListBucketsCommand(params);

// async/await.
try {
  const data = await client.send(command);
  console.log("ok", data);
  // process data.
} catch (error) {
  console.log("err", error);
  // error handling.
} finally {
  // finally.
}

const putCommnd = new PutObjectCommand({
  Body: "blah blah",
  Bucket: "example",
  Key: "kek.jpg",
});

// async/await.
try {
  const data = await client.send(putCommnd);
  console.log("ok", data);
  // process data.
} catch (error) {
  console.log("err", error);
  // error handling.
} finally {
  // finally.
}
