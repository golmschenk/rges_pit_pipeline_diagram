import type {DataFlow} from "../../../element_data_types/data_flow.ts";
import {pipelines} from "../../pipelines.ts";

export default {
    sourcePipeline: pipelines.msosModelingPipeline,
    destinationPipelines: [pipelines.workingGroup3Pipeline, pipelines.workingGroup12Pipeline],
    data: {name: 'Automated light curve modeling results'},
} satisfies DataFlow;
