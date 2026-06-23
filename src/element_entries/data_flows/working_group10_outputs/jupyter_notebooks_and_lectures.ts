import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.workingGroup10Pipeline,
    destinationPipelines: [pipelines.Public],
    data: {
        name: 'Jupyter Notebooks and lectures',
        isOfficialPitPublicDataProduct: true,
    }
} satisfies DataFlow;
