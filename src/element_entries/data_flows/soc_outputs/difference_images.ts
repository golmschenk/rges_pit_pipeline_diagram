import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.socPipeline,
    destinationPipelines: [pipelines.differenceImageAnalysisPipeline],
    data: {
        name: 'Difference images',
    },
} satisfies DataFlow;
