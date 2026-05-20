import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup9Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.Public],
    data: {
        name: 'Data challenges',
        isOfficialPitPublicDataProduct: true,
    }
} satisfies DataFlow;
