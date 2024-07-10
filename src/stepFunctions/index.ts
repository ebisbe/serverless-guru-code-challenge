import { merge } from "lodash";

import { incStream } from "./itemStream";

export const stepFunctions = merge(incStream);
