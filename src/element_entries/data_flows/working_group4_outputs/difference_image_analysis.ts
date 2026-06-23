import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.differenceImageAnalysisPipeline,
    destinationPipelines: [pipelines.workingGroup11Pipeline],
    data: {
        name: 'Difference image analysis',
    },
} satisfies DataFlow;
