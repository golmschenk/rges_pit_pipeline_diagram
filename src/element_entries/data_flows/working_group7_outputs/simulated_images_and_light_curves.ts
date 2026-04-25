import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup7Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup9Pipeline],
    data: {name: 'Simulated images and light curves'}
} satisfies DataFlowData;
