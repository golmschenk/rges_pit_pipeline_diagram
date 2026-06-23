import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.workingGroup9Pipeline,
    destinationPipelines: [pipelines.Public],
    data: {
        name: 'Data challenges',
        isOfficialPitPublicDataProduct: true,
    }
} satisfies DataFlow;
