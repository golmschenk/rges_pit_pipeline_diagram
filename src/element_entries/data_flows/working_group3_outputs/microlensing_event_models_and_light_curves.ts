import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";
import narrativeDescription from './microlensing_event_models_and_light_curves_resources/narrative_description.md?raw'
import {from_markdown} from "../../../markdown.ts";

export default {
    sourcePipeline: pipelines.workingGroup3Pipeline,
    destinationPipelines: [pipelines.workingGroup12Pipeline, pipelines.Public],
    data: {
        name: 'Microlensing event models and light curves',
        isOfficialPitPublicDataProduct: true,
        narrativeDescription: from_markdown(narrativeDescription),
        host: 'MAST',
        totalDataSize: '1.2TB',
        dataElements: [
            {
                name: 'Table with row for all events',
                unit: '~4 viable models per event for all events',
                frequency: 'After each season',
                structure: 'Columns with median properties (which properties?) with credible intervals',
                notes: 'How different types of solutions (1S1L vs 2S1L) to be represented? Perhaps use a relation database instead of a single table?',
                format: 'Parquet',
                totalNumberOfUnits: '120,000 rows (~4 viable models per event, 20,000 rows per season, with updates to old models each season)',
                unitDataSize: '80B',
                totalDataSize: '10MB',
            },
            {
                name: 'Posteriors',
                unit: '~4 viable models per event for all events',
                frequency: 'After detection of event, and re-run at end of season and end of mission (at least)',
                latency: 'days (?)',
                structure: '(parameter values [which parameters?], likelihood)',
                format: 'Parquet',
                totalNumberOfUnits: '120,000 files (~4 viable models per event, 20,000 files per season, with updates to old models each season)',
                unitDataSize: '8MB',
                totalDataSize: '1TB',
            },
            {
                name: 'Light curves',
                unit: 'Per event for all events',
                frequency: 'After detection of event, and re-run at end of season and end of mission (at least)',
                latency: 'days (?)',
                format: 'Parquet',
                totalNumberOfUnits: '30,000 files (5,000 files per season, with updates to old models each season)',
                unitDataSize: '6.6MB',
                totalDataSize: '200GB',
            },
        ],
    },
} satisfies DataFlow;
