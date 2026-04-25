import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.lensFluxAnalysisPipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline],
    data: {name: 'Photometric light curves'}
} satisfies DataFlowData;
