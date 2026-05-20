import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.msosModelingPipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup12Pipeline],
    data: {name: 'Single lens events'},
} satisfies DataFlow;
