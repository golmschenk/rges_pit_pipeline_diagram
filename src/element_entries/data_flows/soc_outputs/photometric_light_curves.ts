import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.socPipeline,
    destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline, pipelineNodeDefinitions.workingGroup13Pipeline,
        pipelineNodeDefinitions.workingGroup5Pipeline],
    data: {
        name: 'Photometric light curves',
        unit: 'For each event target and nearby targets',
        structure: 'Table of (x, y, flux/mag, xerr, yerr, magerr, t) for all time steps, all filters, ' +
            'cross-matched across all seasons',
    },
} satisfies DataFlow;
