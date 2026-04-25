import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.msosModelingPipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline, pipelineNodeDefinitions.workingGroup12Pipeline],
    data: {name: 'Automated light curve modeling results'},
} satisfies DataFlowData;
