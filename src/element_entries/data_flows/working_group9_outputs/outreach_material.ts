import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup9Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.Public],
    data: {
        name: 'Outreach material (data sonifications, etc.)',
        isOfficialPitPublicDataProduct: true,
    }
} satisfies DataFlowData;
