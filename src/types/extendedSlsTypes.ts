import { DynamoDBTableProps } from "@awboost/cfntypes";
import type { Serverless } from "serverless/aws";

export interface Resource<TType extends string, TProps = unknown> {
  Condition?: string | undefined;
  DependsOn?: string | { [key: string]: any } | undefined;
  DeletionPolicy?: string | undefined;
  Type: TType;
  Properties?: TProps;
}

type SlsResource = Resource<"AWS::DynamoDB::Table", DynamoDBTableProps>;

export type ServerlessExtended = Serverless & {
  resources?: {
    Resources?: {
      [k: string]: SlsResource;
    };
  };
};
