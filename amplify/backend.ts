import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { assetUrl } from "./function/resource";
import { addFieldResolver } from "./add_field_resolver";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  assetUrl,
  storage,
});

addFieldResolver({
  data: backend.data,
  lambdaFunction: backend.assetUrl.resources.lambda,
  typeName: "Asset",
  fieldName: "url",
});
