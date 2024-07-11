import { merge } from "lodash";

import { ddbResources } from "./ddb";
import { globalResources } from "./global";
import { streamPipesResource } from "./streamPipes";

const resources = merge(ddbResources, streamPipesResource, globalResources);

export default resources;
