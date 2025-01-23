import { defineStorage } from "@aws-amplify/backend";
import { assetUrl } from "../function/resource";

export const storage = defineStorage({
  name: "assets",
  access: (allow) => ({
    "assets/*": [allow.resource(assetUrl).to(["read"])],
  }),
});
