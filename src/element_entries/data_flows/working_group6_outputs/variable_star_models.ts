import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup6Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.msosPhotometryPipeline],
    data: {name: 'Variable star models'},
} satisfies DataFlow;
