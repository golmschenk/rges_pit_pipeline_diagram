import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.differenceImageAnalysisPipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup11Pipeline],
    data: {
        name: 'Difference image analysis',
    },
} satisfies DataFlowData;
