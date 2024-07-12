import { ItemStream } from "../stepFunctions/itemStream";
import {
  getAttribute,
  getJoin,
  getRef,
  idHelper,
  nameHelper,
  ServerlessExtended,
} from "../types/extendedSlsTypes";
import { WeddingTable } from "./ddb";

export const streamPipesResource: ServerlessExtended["resources"] = {
  Resources: {
    EventBus: {
      Type: "AWS::Events::EventBus",
      Properties: {
        Name: getJoin("_", ["${self:service}", "${self:provider.stage}"]),
      },
    },

    PipeRole: {
      Type: "AWS::IAM::Role",
      Properties: {
        AssumeRolePolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                Service: ["pipes.amazonaws.com"],
              },
              Action: ["sts:AssumeRole"],
            },
          ],
        },
        Policies: [
          {
            PolicyName: "SourcePolicy",
            PolicyDocument: {
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Action: [
                    "dynamodb:DescribeStream",
                    "dynamodb:GetRecords",
                    "dynamodb:GetShardIterator",
                    "dynamodb:ListStreams",
                  ],
                  Resource: [getAttribute(WeddingTable, "StreamArn")],
                },
              ],
            },
          },
          {
            PolicyName: "TargetPolicy",
            PolicyDocument: {
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Action: ["events:PutEvents"],
                  Resource: getAttribute("EventBus", "Arn"),
                },
                {
                  Effect: "Allow",
                  Action: [
                    "states:StartExecution",
                    "states:StartSyncExecution",
                  ],
                  Resource: [getRef(idHelper(ItemStream))],
                },
              ],
            },
          },
        ],
      },
    },

    LogsStreamPipe: {
      Type: "AWS::Pipes::Pipe",
      DependsOn: [idHelper(ItemStream)],
      Properties: {
        Description: "Pipe to connect dynamoDB stream to step function",
        RoleArn: getAttribute("PipeRole", "Arn"),
        Source: getAttribute(WeddingTable, "StreamArn"),
        SourceParameters: {
          DynamoDBStreamParameters: {
            StartingPosition: "LATEST",
            BatchSize: 1,
            OnPartialBatchItemFailure: "AUTOMATIC_BISECT",
          },
          FilterCriteria: {
            Filters: [
              {
                Pattern: JSON.stringify({
                  eventName: ["INSERT", "MODIFY", "REMOVE"],
                  dynamodb: {
                    NewImage: {
                      __typeName: { S: ["Item"] },
                    },
                  },
                }),
              },
            ],
          },
        },
        Target: getAttribute("EventBus", "Arn"),
        TargetParameters: {
          EventBridgeEventBusParameters: {
            DetailType: "item",
            Source: "challenge.code.dynamodb.stream",
          },
        },
      },
    },

    StreamItemRule: {
      Type: "AWS::Events::Rule",
      Properties: {
        EventBusName: getRef("EventBus"),
        EventPattern: {
          source: ["challenge.code.dynamodb.stream"],
          "detail-type": ["item"],
          detail: {
            dynamodb: {
              NewImage: {
                __typeName: { S: ["Item"] },
              },
            },
          },
        },
        State: "ENABLED",
        Targets: [
          {
            Id: `invoke-${nameHelper(ItemStream)}`,
            Arn: getAttribute(idHelper(ItemStream), "Arn"),
            RoleArn: getAttribute("TargetStreamIAMrole", "Arn"),
            InputTransformer: {
              InputPathsMap: {
                eventName: "$.detail.eventName",
                dynamodb: "$.detail.dynamodb",
              },
              InputTemplate: JSON.stringify({
                eventName: "<eventName>",
                dynamodb: "<dynamodb>",
              }),
            },
          },
        ],
      },
    },

    TargetStreamIAMrole: {
      Type: "AWS::IAM::Role",
      Properties: {
        AssumeRolePolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: { Service: { "Fn::Sub": "events.amazonaws.com" } },
              Action: "sts:AssumeRole",
            },
          ],
        },
        Path: "/",
        Policies: [
          {
            PolicyName: "PutEventsDestinationBus",
            PolicyDocument: {
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Action: ["states:startExecution"],
                  Resource: [getAttribute(idHelper(ItemStream), "Arn")],
                },
              ],
            },
          },
        ],
      },
    },
  },
};
