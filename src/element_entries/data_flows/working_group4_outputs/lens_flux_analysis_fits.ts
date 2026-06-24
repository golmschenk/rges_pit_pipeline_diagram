import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";
import {from_markdown} from "../../../markdown.ts";
import narrativeDescription from './lens_flux_analysis_fits_resources/narrative_description.md?raw'

export default {
    sourcePipeline: pipelines.lensFluxAnalysisPipeline,
    destinationPipelines: [pipelines.Public],
    data: {
        name: 'Lens flux analysis fits',
        host: 'MAST',
        narrativeDescription: from_markdown(narrativeDescription),
        isOfficialPitPublicDataProduct: true,
        dataElements: [
            {
                name: 'Lens flux analysis best-fit model parameters',
                unit: 'Per event for all events',
                frequency: 'After each event',
                structure: '23 parameters per row [what parameters?]',
                totalNumberOfUnits: '30,000 rows (5,000 rows per season, with updates to old models each season)',
                unitDataSize: '92B',
                totalDataSize: '20MB',
            },
            {
                name: 'Lens flux analysis model parameter posteriors',
                unit: 'Per event for all events',
                frequency: 'After each event',
                structure: '23 parameters per row [what parameters?], with 100,000 rows per posterior',
                totalNumberOfUnits: '30,000 rows (5,000 rows per season, with updates to old models each season)',
                unitDataSize: '92B',
                totalDataSize: '20MB',
            },
        ],
    },
} satisfies DataFlow;
