import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.msosModelingPipeline,
    destinationPipelines: [pipelines.workingGroup12Pipeline],
    data: {name: 'Single lens events'},
} satisfies DataFlow;
