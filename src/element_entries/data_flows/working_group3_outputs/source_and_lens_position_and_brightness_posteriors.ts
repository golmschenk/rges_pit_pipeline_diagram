import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
        sourcePipeline: pipelineNodeDefinitions.lensFluxAnalysisPipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline],
        data: {name: 'Source and Lens position and brightness posteriors'}
} satisfies DataFlowData;
