import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup11Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.Public],
    data: {
        name: 'Free-floating planet catalog',
        isOfficialPitPublicDataProduct: true,
        host: 'MAST',
        totalDataSize: '18GB',
        narrativeDescription: 'This dataset will consist of free-floating planet candidate light curves and fitted event parameters produced by the PIT\'s FFP detection pipeline. Although free-floating planets have been predicted to outnumber bound planets, little is known about this population. Characterizing the abundance of free-floating planets across a wide range of masses provides a key test of various competing models of planet formation, probing an epoch in system evolution that is otherwise difficult to observe. This dataset will provide the largest sample of FFP events to date, outnumbering existing catalogs by over an order of magnitude, and provides researchers with a critical resource for understanding the origins of these worlds.',
        dataElements: [
            {
                name: 'Free floating planet properties',
                unit: 'Row per FFP event',
                frequency: 'After each season',
                structure: 'Columns with median properties [which properties?] with credible intervals',
                totalNumberOfUnits: '1,200 rows (200 rows per season)',
                format: 'Parquet',
                unitDataSize: '80B',
                totalDataSize: '2KB',
            },
            {
                name: 'Posteriors',
                unit: 'Per FFP event',
                frequency: 'After detection of event, and re-run at end of season (at least)',
                structure: '(parameter values [which parameters?], likelihood)',
                format: 'Parquet',
                totalNumberOfUnits: '1,200 files (200 files per season)',
                unitDataSize: '8KB',
                totalDataSize: '10GB',
            },
            {
                name: 'Light curves',
                unit: 'Per FFP event',
                frequency: 'After detection of event, and re-run at end of season (at least)',
                format: 'ASDF',
                totalNumberOfUnits: '1,200 files (200 files per season)',
                unitDataSize: '6.6MB',
                totalDataSize: '8GB',
            },
        ],
    }
} satisfies DataFlowData;
