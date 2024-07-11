import { ServerlessExtended } from "../types/extendedSlsTypes";

export const globalResources: ServerlessExtended["resources"] = {
  Resources: {
    StepFunctionsLogGroup: {
      Type: "AWS::Logs::LogGroup",
      Properties: {
        RetentionInDays: 14,
        LogGroupName:
          "/aws/vendedlogs/states/${self:service}/${self:provider.stage}-logs",
      },
    },
  },
};
