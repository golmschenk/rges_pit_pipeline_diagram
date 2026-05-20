import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.differenceImageAnalysisPipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup11Pipeline],
    data: {
        name: 'Difference image analysis',
    },
} satisfies DataFlow;
