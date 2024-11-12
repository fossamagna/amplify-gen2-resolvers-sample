import { defineBackend } from "@aws-amplify/backend";
import type { AmplifyGraphqlApi } from "@aws-amplify/graphql-api-construct";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { assetUrl } from "./function/resource";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as appsync from "aws-cdk-lib/aws-appsync";

const backend = defineBackend({
  auth,
  data,
  assetUrl,
});

addFieldResolver({
  data: backend.data,
  lambdaFunction: backend.assetUrl.resources.lambda,
  typeName: "Asset",
  fieldName: "url",
});

function addFieldResolver({
  data,
  lambdaFunction,
  fieldName,
  typeName,
}: {
  data: Omit<AmplifyGraphqlApi, "getResourceAccessAcceptor">;
  lambdaFunction: lambda.IFunction;
  typeName: string;
  fieldName: string;
}) {
  const dataSource = data.addLambdaDataSource(
    `${typeName}${fieldName}DataSource`,
    lambdaFunction,
    {}
  );

  const appsyncFunction = data.addFunction(`${typeName}${fieldName}Function`, {
    dataSource,
    name: `${typeName}${fieldName}Function`,
    runtime: appsync.FunctionRuntime.JS_1_0_0,
    code: appsync.AssetCode.fromInline(`
export function request(ctx) {
  return {
    operation: 'Invoke',
    payload: {
      typeName: '${typeName}',
      field: '${fieldName}',
      arguments: ctx.args,
      identity: ctx.identity,
      source: ctx.source,
      request: ctx.request,
      prev: ctx.prev,
    },
    invocationType: "RequestResponse"
  };
}
export function response(ctx) {
  return ctx.result
}
`),
  });

  data.addResolver(`${typeName}${fieldName}Resolver`, {
    fieldName,
    typeName,
    pipelineConfig: [appsyncFunction],
    runtime: appsync.FunctionRuntime.JS_1_0_0,
    code: appsync.AssetCode.fromInline(`
export function request(ctx) {
  return {};
}
export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.prev.result;
}
`),
  });
}
