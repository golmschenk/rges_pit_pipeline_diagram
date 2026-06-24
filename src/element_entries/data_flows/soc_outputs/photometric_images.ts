import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.socPipeline,
    destinationPipelines: [pipelines.differenceImagePipeline],
    data: {
        name: 'Images',
    },
} satisfies DataFlow;
