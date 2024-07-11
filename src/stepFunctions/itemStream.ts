import { WeddingTable } from "../resources/ddb";
import { getRef, idHelper, nameHelper } from "../types/extendedSlsTypes";

export const ItemStream = "ItemStream";

export const itemStream = {
  stateMachines: {
    [ItemStream]: {
      id: idHelper(ItemStream),
      name: nameHelper(ItemStream),
      type: "EXPRESS",
      useExactVersion: true,
      definition: {
        Comment: "Update List totals ( price and total items )",
        StartAt: "Check event type",
        States: {
          "Check event type": {
            Type: "Choice",
            Choices: [
              {
                Variable: "$.eventName",
                StringEquals: "INSERT",
                Next: "Increment totalPrice and totalItems",
              },
              {
                Variable: "$.eventName",
                StringEquals: "MODIFY",
                Next: "Compute price difference",
              },
              {
                Variable: "$.eventName",
                StringEquals: "REMOVE",
                Next: "Decrease totalPrice and totalItems",
              },
            ],
            OutputPath: "$.dynamodb",
            Default: "Fail",
          },
          "Compute price difference": {
            Type: "Pass",
            Next: "Update totalPrice",
          },
          "Increment totalPrice and totalItems": {
            Type: "Task",
            Resource: "arn:aws:states:::dynamodb:updateItem",
            Parameters: {
              TableName: getRef(WeddingTable),
              Key: {
                pk: {
                  "S.$": "States.Format('LIST#{}',$.NewImage.listId.S)",
                },
                sk: {
                  "S.$": "States.Format('LIST#{}',$.NewImage.listId.S)",
                },
              },
              UpdateExpression:
                "SET totalPrice = totalPrice + :itemPrice, totalItems = totalItems + :addOne",
              ExpressionAttributeValues: {
                ":itemPrice": {
                  "N.$": "$.NewImage.price.N",
                },
                ":addOne": {
                  N: "1",
                },
              },
            },
            End: true,
          },
          Fail: {
            Type: "Fail",
            Error: "Missing EventType",
          },
          "Update totalPrice": {
            Type: "Task",
            Resource: "arn:aws:states:::dynamodb:updateItem",
            Parameters: {
              TableName: getRef(WeddingTable),
              Key: {
                pk: {
                  "S.$": "States.Format('LIST#{}',$.NewImage.listId.S)",
                },
                sk: {
                  "S.$": "States.Format('LIST#{}',$.NewImage.listId.S)",
                },
              },
              UpdateExpression:
                "SET totalPrice = totalPrice - :oldPrice + :newPrice",
              ExpressionAttributeValues: {
                ":newPrice": {
                  "N.$": "$.NewImage.price.N",
                },
                ":oldPrice": {
                  "N.$": "$.OldImage.price.N",
                },
              },
            },
            End: true,
          },
          "Decrease totalPrice and totalItems": {
            Type: "Task",
            Resource: "arn:aws:states:::dynamodb:updateItem",
            Parameters: {
              TableName: getRef(WeddingTable),
              Key: {
                pk: {
                  "S.$": "States.Format('LIST#{}',$.NewImage.listId.S)",
                },
                sk: {
                  "S.$": "States.Format('LIST#{}',$.NewImage.listId.S)",
                },
              },
              UpdateExpression:
                "SET totalPrice = totalPrice - :itemPrice, totalItems = totalItems - :one",
              ExpressionAttributeValues: {
                ":itemPrice": {
                  "N.$": "$.NewImage.price.N",
                },
                ":one": {
                  N: "1",
                },
              },
            },
            End: true,
          },
        },
      },
    },
  },
};
