import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.socPipeline,
    destinationPipelines: [pipelineNodeDefinitions.differenceImageAnalysisPipeline],
    data: {
        name: 'Difference images',
    },
} satisfies DataFlowData;
