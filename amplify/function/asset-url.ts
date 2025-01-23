import type { AppSyncResolverHandler } from "aws-lambda";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { env } from "$amplify/env/asset-url";

export const handler: AppSyncResolverHandler<unknown, string> = async (
  event,
  context
) => {
  console.log("Event: ", JSON.stringify(event, null, 2));
  console.log("Context: ", JSON.stringify(context, null, 2));
  if (!event.source) {
    throw new Error("Event source is not found.");
  }
  const client = new S3Client({
    region: env.AWS_REGION,
  });
  const params: GetObjectCommandInput = {
    Bucket: env.ASSETS_BUCKET_NAME,
    Key: event.source.name,
  };
  const command = new GetObjectCommand(params);
  return await getSignedUrl(client, command, { expiresIn: 3600 });
};
