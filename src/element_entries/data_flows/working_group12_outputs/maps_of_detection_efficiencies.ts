import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup12Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.Public],
    data: {
        name: 'Maps of detection efficiencies (false negatives)',
        host: 'Exoplanet Archive',
        isOfficialPitPublicDataProduct: true,
        notes: 'MSOS detection efficiencies are not expected to be delivered until the end of the GBTDS, so the PIT will provide early-look detection efficiencies at different levels of fidelity, with at least two depths: Pixel-level analysis and Flux-level analysis. \n' +
            'In addition, the PIT will develop and deliver additional statistics for detection efficiency maps.\n' +
            'As well as providing early-look detection efficiencies of the simple PSPL case, the PIT will provide some preliminary detection efficiencies for cases with higher-order effects, such as limb-darkening and multi-planet systems.',
        dataElements: [
            {
                name: 'Pixel-level analysis',
                frequency: 'After each season',
                notes: 'Shallow but sufficient coverage across event magnitudes to constrain S/N losses between images and light curves.',
            },
            {
                name: 'Flux-level analysis (global map)',
                unit: 'Single global map over all events',
                frequency: 'After each season',
                structure: 'map over (q, s)',
            },
            {
                name: 'Flux-level analysis (per event map)',
                unit: 'Map per event',
                frequency: 'After each season (starting after season 3)',
                structure: 'map over (q, s, alpha), targeting grids of 100 q (from 1e-6 to 1e-1) x 100 s (from 0.1 to 6 θE) x 360 alpha (from 1 to 360 degrees)'
            },
            {
                name: 'Early-look detection efficiencies',
                frequency: 'After each season',
                notes: 'As well as providing early-look detection efficiencies of the simple PSPL case, the PIT will provide some preliminary detection efficiencies for cases with higher-order effects, such as limb-darkening and multi-planet systems.',
            },
        ],
    },
} satisfies DataFlow;
