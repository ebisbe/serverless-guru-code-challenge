import {
  DynamoDBTableProps,
  EventsEventBusProps,
  IAMRoleProps,
  PipesPipeProps,
} from "@awboost/cfntypes";
import type { IamRoleStatement, Serverless } from "serverless/aws";
import type StepFunctions from "serverless-step-functions";

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
 * Generate a state machine name with the followin pattern: service-stage-name
 * @param name string
 * @returns
 */
export function nameHelper(name: string) {
  return `\${self:service}-\${self:provider.stage}-${name}`;
}

/**
 * Generates a logical id name similar to the original
 * @param name string
 * @returns
 */
export function idHelper(name: string) {
  return `${name}StepFunctionsStateMachine`;
}

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

declare module "serverless/aws" {
  interface Serverless {
    stepFunctions?: StepFunctions;
  }
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
