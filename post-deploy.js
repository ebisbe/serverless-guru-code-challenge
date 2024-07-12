import { execSync } from "child_process";
import { writeFileSync } from "fs";

try {
  // Execute `sls info --verbose` and capture output
  const output = execSync("pnpm sls info --verbose", { encoding: "utf-8" });

  // Extract the API Gateway URL from the output
  const match = output.match(/HttpApiUrl: (.*)/);
  if (match && match.length > 1) {
    const apiGatewayUrl = match[1].trim();

    // Write the URL to the .env file
    writeFileSync(".env.e2e", `API_GATEWAY_URL=${apiGatewayUrl}\n`);

    console.log(`API Gateway URL: ${apiGatewayUrl}`);
  } else {
    console.error("Failed to extract API Gateway URL from `sls info` output.");
  }
} catch (error) {
  console.error("Error executing `sls info` command:", error);
}
