import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
        sourcePipeline: pipelines.lensFluxAnalysisPipeline,
        destinationPipelines: [pipelines.workingGroup3Pipeline],
        data: {name: 'Source and Lens position and brightness posteriors'}
} satisfies DataFlow;
