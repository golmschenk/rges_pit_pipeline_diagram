import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup7Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup9Pipeline],
    data: {name: 'Simulated images and light curves'}
} satisfies DataFlow;
