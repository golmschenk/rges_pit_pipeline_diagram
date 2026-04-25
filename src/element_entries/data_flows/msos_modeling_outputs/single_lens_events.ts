import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.msosModelingPipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup12Pipeline],
    data: {name: 'Single lens events'},
} satisfies DataFlowData;
