import { merge } from "lodash";

import { ddbResources } from "./ddb";
import { streamPipesResource } from "./streamPipes";

const resources = merge(ddbResources, streamPipesResource);

export default resources;
