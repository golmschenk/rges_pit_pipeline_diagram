import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup10Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.Public],
    data: {
        name: 'Jupyter Notebooks and lectures',
        isOfficialPitPublicDataProduct: true,
    }
} satisfies DataFlow;
