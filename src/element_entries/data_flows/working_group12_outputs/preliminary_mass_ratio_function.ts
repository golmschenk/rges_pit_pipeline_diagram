import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup12Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.Public],
    data: {
        name: 'Preliminary mass ratio function',
        host: 'Exoplanet Archive',
        isOfficialPitPublicDataProduct: true,
        frequency: 'After each season, starting with the end of the third season',
        notes: 'After the first three seasons, the vast majority of the microlensing events will not have sufficient observational baseline for proper motions to provide lens masses, but mass ratios will be available for each event.' +
            'Three seasons: initial mass ratio function over the range 1e-6 < q < 1e-1.',
    }
} satisfies DataFlow;
