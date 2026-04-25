import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup10Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.Public],
    data: {
        name: 'Jupyter Notebooks and lectures',
        isOfficialPitPublicDataProduct: true,
    }
} satisfies DataFlowData;
