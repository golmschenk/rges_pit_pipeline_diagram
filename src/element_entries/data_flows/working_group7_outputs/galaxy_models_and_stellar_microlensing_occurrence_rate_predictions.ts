import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup7Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup12Pipeline],
    data: {name: 'Galaxy models and stellar microlensing occurrence rate predictions'},
} satisfies DataFlow;
