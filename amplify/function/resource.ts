import { defineFunction } from "@aws-amplify/backend";

export const assetUrl = defineFunction({
  entry: "./asset-url.ts",
});
