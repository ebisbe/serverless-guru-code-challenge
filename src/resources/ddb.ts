import { ServerlessExtended } from "../types/extendedSlsTypes";

export const WeddingTable = "DdbTable";

export const ddbResources: ServerlessExtended["resources"] = {
  Resources: {
    [WeddingTable]: {
      Type: "AWS::DynamoDB::Table",
      Properties: {
        AttributeDefinitions: [
          {
            AttributeName: "pk",
            AttributeType: "S",
          },
          {
            AttributeName: "sk",
            AttributeType: "S",
          },
        ],
        KeySchema: [
          {
            AttributeName: "pk",
            KeyType: "HASH",
          },
          {
            AttributeName: "sk",
            KeyType: "RANGE",
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
        StreamSpecification: {
          StreamViewType: "NEW_AND_OLD_IMAGES",
        },
      },
    },
  },
};
