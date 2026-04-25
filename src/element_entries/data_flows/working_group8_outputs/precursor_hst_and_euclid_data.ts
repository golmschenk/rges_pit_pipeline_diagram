import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup8Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.lensFluxAnalysisPipeline],
    data: {
        name: 'Precursor HST and Euclid data',
        unit: 'For each field/event',
        frequency: 'One-time catalog prior to first Roman data',
        notes: 'Calibrated HST images and point source catalogs.\n' +
            'Euclid image/data hosting policy is TBD.',
        dataElements: [
            {
                name: 'Images',
                structure: 'Drizzled Reference Image',
                format: '.fits',
                notes: 'Images are hosted and downloadable at SOC/MAST.',
            },
            {
                name: 'Photometry',
                structure: 'Catalog of calibrated PSF photometry',
                notes: 'Single-star PSF fit to all detected sources.',
            },
            {
                name: 'Astrometry',
                structure: 'Catalog of calibrated PSF astrometry',
                notes: 'Single-star PSF fit to all detected sources.'
            },
        ],
    },
} satisfies DataFlowData;
