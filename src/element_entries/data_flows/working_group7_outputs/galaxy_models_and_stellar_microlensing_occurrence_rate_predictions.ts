import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.workingGroup7Pipeline,
    destinationPipelines: [pipelines.workingGroup12Pipeline],
    data: {name: 'Galaxy models and stellar microlensing occurrence rate predictions'},
} satisfies DataFlow;
