import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.workingGroup6Pipeline,
    destinationPipelines: [pipelines.msosPhotometryPipeline],
    data: {name: 'Variable star models'},
} satisfies DataFlow;
