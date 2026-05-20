import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.socPipeline,
    destinationPipelines: [pipelineNodeDefinitions.differenceImageAnalysisPipeline],
    data: {
        name: 'Difference images',
    },
} satisfies DataFlow;
