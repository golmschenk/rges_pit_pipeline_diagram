import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.socPipeline,
    destinationPipelines: [pipelines.workingGroup3Pipeline, pipelines.workingGroup13Pipeline,
        pipelines.workingGroup5Pipeline],
    data: {
        name: 'Photometric light curves',
        unit: 'For each event target and nearby targets',
        structure: 'Table of (x, y, flux/mag, xerr, yerr, magerr, t) for all time steps, all filters, ' +
            'cross-matched across all seasons',
    },
} satisfies DataFlow;
