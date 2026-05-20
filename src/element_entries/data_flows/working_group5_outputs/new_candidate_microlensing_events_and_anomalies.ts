import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup5Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline, pipelineNodeDefinitions.workingGroup11Pipeline],
    data: {name: 'New candidate microlensing events and anomalies'}
} satisfies DataFlow;
