import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup7Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup12Pipeline],
    data: {name: 'Galaxy models and stellar microlensing occurrence rate predictions'},
} satisfies DataFlowData;
