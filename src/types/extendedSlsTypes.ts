import {
  DynamoDBTableProps,
  EventsEventBusProps,
  IAMRoleProps,
  PipesPipeProps,
} from "@awboost/cfntypes";
import type { IamRoleStatement, Serverless } from "serverless/aws";

export interface Resource<TType extends string, TProps = unknown> {
  Condition?: string | undefined;
  DependsOn?: string | { [key: string]: any } | undefined;
  DeletionPolicy?: string | undefined;
  Type: TType;
  Properties?: TProps;
}

type SlsResource =
  | Resource<"AWS::DynamoDB::Table", DynamoDBTableProps>
  | Resource<"AWS::Events::EventBus", EventsEventBusProps>
  | Resource<"AWS::IAM::Role", IAMRoleProps>
  | Resource<"AWS::Pipes::Pipe", PipesPipeProps>;

/**
 * Gets the attribute value.
 * @param resource The resource to get the attribute for.
 * @param name The name of the attribute to get.
 */
export function getAttribute(resource: string, name: string): string {
  return { "Fn::GetAtt": [resource, name] } as unknown as string;
}

/**
 * Gets the attribute value.
 * @param delimiter The delimiter string that will be used as glue.
 * @param stringsList Array of strings to be merged.
 */
export function getJoin(delimiter: string, stringsList: string[]): string {
  return { "Fn::Join": [delimiter, stringsList] } as unknown as string;
}

export function getRef(name: string): string {
  return { Ref: name } as unknown as string;
}

export type ServerlessExtended = Serverless & {
  functions: {
    [key: string]: {
      iamRoleStatements?: IamRoleStatement[];
    } & NonNullable<Serverless["functions"]>[string];
  };
  resources?: {
    Resources?: {
      [k: string]: SlsResource;
    };
  };
};