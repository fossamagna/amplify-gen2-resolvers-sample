import type { AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<unknown, string> = async (
  event,
  context
) => {
  console.log("Event: ", JSON.stringify(event, null, 2));
  console.log("Context: ", JSON.stringify(context, null, 2));
  return "http://example.com";
};
