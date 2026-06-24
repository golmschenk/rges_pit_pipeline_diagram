import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";
import narrativeDescription from './preliminary_mass_ratio_function_resources/narrative_description.md?raw'
import {from_markdown} from "../../../markdown.ts";

export default {
    sourcePipeline: pipelines.workingGroup12Pipeline,
    destinationPipelines: [pipelines.Public],
    data: {
        name: 'Preliminary mass ratio function',
        host: 'Exoplanet Archive',
        narrativeDescription: from_markdown(narrativeDescription),
        isOfficialPitPublicDataProduct: true,
        frequency: 'After each season, starting with the end of the third season',
        notes: 'After the first three seasons, the vast majority of the microlensing events will not have sufficient observational baseline for proper motions to provide lens masses, but mass ratios will be available for each event.' +
            'Three seasons: initial mass ratio function over the range 1e-6 < q < 1e-1.',
    }
} satisfies DataFlow;
