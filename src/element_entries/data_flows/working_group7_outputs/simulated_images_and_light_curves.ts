import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.workingGroup7Pipeline,
    destinationPipelines: [pipelines.workingGroup9Pipeline],
    data: {name: 'Simulated images and light curves'}
} satisfies DataFlow;
