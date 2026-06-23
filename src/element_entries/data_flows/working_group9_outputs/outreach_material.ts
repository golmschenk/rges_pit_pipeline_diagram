import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.workingGroup9Pipeline,
    destinationPipelines: [pipelines.Public],
    data: {
        name: 'Outreach material (data sonifications, etc.)',
        isOfficialPitPublicDataProduct: true,
    }
} satisfies DataFlow;
