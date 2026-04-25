import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup6Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.msosPhotometryPipeline],
    data: {name: 'Variable star models'},
} satisfies DataFlowData;
