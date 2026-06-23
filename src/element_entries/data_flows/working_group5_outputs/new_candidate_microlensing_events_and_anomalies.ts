import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.workingGroup5Pipeline,
    destinationPipelines: [pipelines.workingGroup3Pipeline, pipelines.workingGroup11Pipeline],
    data: {name: 'New candidate microlensing events and anomalies'}
} satisfies DataFlow;
