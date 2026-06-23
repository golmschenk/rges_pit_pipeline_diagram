import type {DataFlow} from "../../../element_data_types/data_flow.ts";
import {pipelines} from "../../pipelines.ts";

export default {
    sourcePipeline: pipelines.msosModelingPipeline,
    destinationPipelines: [pipelines.workingGroup13Pipeline],
    data: {name: 'Astrometric estimate data'}
} satisfies DataFlow;
