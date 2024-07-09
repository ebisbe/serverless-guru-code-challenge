import { merge } from "lodash";

import { ddbResources } from "./ddb";

const resources = merge(ddbResources);

export default resources;
