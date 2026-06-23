import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.workingGroup12Pipeline,
    destinationPipelines: [pipelines.Public],
    data: {
        name: 'Maps of reliability (false positives)',
        host: 'Exoplanet Archive',
        isOfficialPitPublicDataProduct: true,
        frequency: 'After each season',
        notes: 'Maps of reliability (false positives). There is considerable uncertainty about the rate of false positives that will contaminate the microlensing event detection pipeline and how they will be distributed over detection space; the first few seasons will be incredibly informative as to the true scale of the different contributions to the total false positive rate.\n' +
            'First season: First constraints on contamination levels from flares and solar system objects\n' +
            'Three seasons: More comprehensive maps of false positive rates over q,s space',
    },
} satisfies DataFlow;
