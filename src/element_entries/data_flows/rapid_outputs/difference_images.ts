import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.rapidPipeline,
    destinationPipelines: [pipelines.differenceImageAnalysisPipeline],
    data: {
        name: 'Difference images',
    },
} satisfies DataFlow;
