import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.lensFluxAnalysisPipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline],
    data: {name: 'Photometric light curves'}
} satisfies DataFlow;
