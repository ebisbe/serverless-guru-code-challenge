import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { parseArgs } from "util";

const args = process.argv;
const options = {
  name: {
    type: "string",
  },
  region: {
    type: "string",
  },
};
const { values } = parseArgs({
  args,
  options,
  allowPositionals: true,
});

// Execute the AWS CLI command to get the CloudFormation outputs
const output = execSync(
  `aws cloudformation describe-stacks --stack-name ${values.name} --region ${values.region} --query "Stacks[0].Outputs" --output json`,
);

// Parse the output
const outputs = JSON.parse(output);

// Find the API Gateway URL
const apiGatewayUrl = outputs.find(
  (o) => o.OutputKey === "HttpApiUrl",
).OutputValue;

// Write the URL to the .env file
writeFileSync(".env.e2e", `API_GATEWAY_URL=${apiGatewayUrl}\n`);
