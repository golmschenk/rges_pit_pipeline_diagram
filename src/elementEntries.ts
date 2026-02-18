import {
    type PipelineNodeDefinition,
    PipelineNodeType
} from "./graphTypes.ts";
import {createDataFlowDefinitionAndAppendToElementDefinitions, createPipelineNodeDefinition} from "./graphFactories.ts";
import type {ElementDefinition} from "cytoscape";
import type {DataFlowData} from "./graphTypes.ts";


export type WorkingGroup = {
    number: number
    name: string
}

export const WorkingGroups = {
    workingGroup1: {number: 1, name: 'Leadership and Project Management'},
    workingGroup2: {number: 2, name: 'Education, Outreach, and Community'},
    workingGroup3: {number: 3, name: 'Event Modeling'},
    workingGroup4: {number: 4, name: 'Lens Flux Analysis'},
    workingGroup5: {number: 5, name: 'Event and Anomaly Detection'},
    workingGroup6: {number: 6, name: 'Variable Stars'},
    workingGroup7: {number: 7, name: 'Survey Simulations and Pipeline Validation'},
    workingGroup8: {number: 8, name: 'Contemporaneous and Precursor Observations'},
    workingGroup9: {number: 9, name: 'Data Challenges, Outreach, and Citizen Science'},
    workingGroup10: {number: 10, name: 'Microlensing Mini-Courses'},
    workingGroup11: {number: 11, name: 'Free Floating Planets'},
    workingGroup12: {number: 12, name: 'Efficiency and Occurrence Rate Analysis'},
    workingGroup13: {number: 13, name: 'Astrometry'},
    workingGroup14: {number: 14, name: 'Global Pipeline'},
} satisfies Record<string, WorkingGroup>;

export const pipelineNodeDefinitions = {
    workingGroup3Pipeline: createPipelineNodeDefinition('Event modeling pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup3),
    lensFluxAnalysisPipeline: createPipelineNodeDefinition('Lens flux analysis pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup4),
    differenceImageAnalysisPipeline: createPipelineNodeDefinition('Difference image analysis pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup4),
    workingGroup5Pipeline: createPipelineNodeDefinition('Event and anomaly detection pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup5),
    workingGroup6Pipeline: createPipelineNodeDefinition('Variable stars pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup6),
    workingGroup7Pipeline: createPipelineNodeDefinition('Survey simulations and pipeline validation pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup7),
    workingGroup8Pipeline: createPipelineNodeDefinition('Contemporaneous and precursor observations pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup8),
    workingGroup9Pipeline: createPipelineNodeDefinition('Data challenges, outreach, and citizen science pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup9),
    workingGroup10Pipeline: createPipelineNodeDefinition('Microlensing mini-courses pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup10),
    workingGroup11Pipeline: createPipelineNodeDefinition('Free floating planets pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup11),
    workingGroup12Pipeline: createPipelineNodeDefinition('Efficiency and occurrence rate analysis pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup12),
    workingGroup13Pipeline: createPipelineNodeDefinition('Astrometry analysis pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup13),
    Public: createPipelineNodeDefinition('Public', PipelineNodeType.Public),
    msosPhotometryPipeline: createPipelineNodeDefinition('MSOS photometry', PipelineNodeType.ExternalGroupPipeline),
    msosModelingPipeline: createPipelineNodeDefinition('MSOS modeling', PipelineNodeType.ExternalGroupPipeline),
    socPipeline: createPipelineNodeDefinition('SOC', PipelineNodeType.ExternalGroupPipeline),
} satisfies Record<string, PipelineNodeDefinition>;

let elementDefinitions: ElementDefinition[] = Object.values(pipelineNodeDefinitions);

export const dataFlows: DataFlowData[] = [
    {
        sourcePipeline: pipelineNodeDefinitions.lensFluxAnalysisPipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline],
        data: {name: 'Source and Lens position and brightness posteriors'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup7Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline],
        data: {name: 'Simulated light curves'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup5Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline, pipelineNodeDefinitions.workingGroup11Pipeline],
        data: {name: 'New candidate microlensing events and anomalies'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup3Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup12Pipeline, pipelineNodeDefinitions.Public],
        data: {
            name: 'Microlensing event models and light curves',
            isOfficialPitPublicDataProduct: true,
            host: 'MAST',
            totalDataSize: '1.2TB',
            dataElements: [
                {
                    name: 'Table with row for all events',
                    unit: '~4 viable models per event for all events',
                    frequency: 'After each season',
                    structure: 'Columns with median properties (which properties?) with credible intervals',
                    notes: 'How different types of solutions (1S1L vs 2S1L) to be represented? Perhaps use a relation database instead of a single table?',
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
    },
    {
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
    },
    {
        sourcePipeline: pipelineNodeDefinitions.lensFluxAnalysisPipeline,
        destinationPipelines: [pipelineNodeDefinitions.Public],
        data: {
            name: 'Lens flux analysis fits',
            host: 'MAST',
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
    },
    {
        sourcePipeline: pipelineNodeDefinitions.msosModelingPipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline, pipelineNodeDefinitions.workingGroup12Pipeline],
        data: {name: 'Automated light curve modeling results'},
    },
    {
        sourcePipeline: pipelineNodeDefinitions.msosModelingPipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup12Pipeline],
        data: {name: 'Single lens events'},
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup6Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.msosPhotometryPipeline],
        data: {name: 'Variable star models'},
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup6Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.Public],
        data: {
            name: 'Simulated variable star light curves',
            isOfficialPitPublicDataProduct: true,
        },
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup7Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup12Pipeline],
        data: {name: 'Galaxy models and stellar microlensing occurrence rate predictions'},
    },
    {
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
                    notes: 'Shallow but sufficient coverage across event magnitudes to constrain S/N losses between images and light curves.',
                },
                {
                    name: 'Flux-level analysis',
                    notes: 'Deep, comprehensive analysis producing maps over q,s space',
                    // TODO: Left off here.
                    // unit: 'Per event for all events',
                    // frequency: 'After each event',
                    // structure: '23 parameters per row [what parameters?], with 100,000 rows per posterior',
                    // totalNumberOfUnits: '30,000 rows (5,000 rows per season, with updates to old models each season)',
                    // unitDataSize: '92B',
                    // totalDataSize: '20MB',
                },
            ],
        },
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup12Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.Public],
        data: {
            name: 'Maps of reliability (false positives)',
            host: 'Exoplanet Archive',
            isOfficialPitPublicDataProduct: true,
            // TODO: Left off here.
            notes: 'Maps of reliability (false positives). There is considerable uncertainty about the rate of false positives that will contaminate the microlensing event detection pipeline and how they will be distributed over detection space; the first few seasons will be incredibly informative as to the true scale of the different contributions to the total false positive rate.\n' +
                'First season: First constraints on contamination levels from flares and solar system objects\n' +
                'Three seasons: More comprehensive maps of false positive rates over q,s space',
        },
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup12Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.Public],
        data: {
            name: 'Preliminary mass ratio function',
            host: 'Exoplanet Archive',
            isOfficialPitPublicDataProduct: true,
            // TODO: Left off here.
            notes: 'After the first three seasons, the vast majority of the microlensing events will not have sufficient observational baseline for proper motions to provide lens masses, but mass ratios will be available for each event.' +
                'Three seasons: initial mass ratio function over the range 1e-6 < q < 1e-1.',
        }
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup12Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.Public],
        data: {
            name: 'Occurrence rates',
            host: 'Exoplanet Archive',
            isOfficialPitPublicDataProduct: true,
            // TODO: Left off here.
            notes: 'The PIT will provide preliminary occurrence rates, including upper limits where appropriate, using the above products across a grid of 0.1Me < m < 30MJup and 1 < a < 10 au, assuming an appropriate distribution of stellar masses, and assess progress towards meeting the baseline science requirements.',
        }
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup7Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup9Pipeline],
        data: {name: 'Simulated images and light curves'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup9Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.Public],
        data: {
            name: 'Data challenges',
            isOfficialPitPublicDataProduct: true,
        }
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup9Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.Public],
        data: {
            name: 'Outreach material (data sonifications, etc.)',
            isOfficialPitPublicDataProduct: true,
        }
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup10Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.Public],
        data: {
            name: 'Jupyter Notebooks and lectures',
            isOfficialPitPublicDataProduct: true,
        }
    },
    {
        sourcePipeline: pipelineNodeDefinitions.msosPhotometryPipeline,
        destinationPipelines: [pipelineNodeDefinitions.socPipeline],
        data: {
            name: 'Photometry data points',
            unit: 'Per source in input catalog',
            frequency: 'After each Roman image',
            latency: 'Within 2 days',
            structure: 'Table of (x, y, flux/mag, xerr, yerr, magerr, t) for all time steps, all filters, ' +
                'cross-matched across all seasons',
            notes: 'Initial catalog of sources:<br><ul class="list-disc list-outside px-5">' +
                '<li>Catalog is built with PSF photometry (one product)</li>' +
                '<li>Take one week of data</li>' +
                '<li>~ 700 images</li>' +
                '<li>Averaging, etc.</li>' +
                '<li>Visible sources survive</li>' +
                '<li>There will be the equivalent of the TIC numbers</li>' +
                '<li>Pretty complete down to 25 magnitude</li>' +
                '<li>Catalog is fixed, but update parameters of each source every eight days</li>' +
                '<li>Sources may get added throughout season, then reprocessing at the end of the season for things missed early in the season</li>' +
                '<li>MSOS releases nothing for the first month of the first season</li>' +
                '<li>At 30 days, we get the catalog and we get the light curve for those 30 days</li>' +
                '</ul><br>' +
                'Will not produce the light curves themselves. Will hand these data points off to the SOC every 2 ' +
                'days and expects the SOC to stitch together the light curves and release them. They will also not ' +
                'directly release these data points. This also goes to through the SOC. The SOC is expected to ' +
                'release the data "promptly" after receiving it. Unclear if the SOC intends to make the individual ' +
                'data point tables available or just the resulting light curves after stitching.'
            ,
            dataElements: [
                {
                    name: 'PSF photometry data points',
                    notes: 'Single star fit to catalog position, single star fit with floating centroid, multiple ' +
                        'star fit with fixed centroid (week before location)'
                },
                {
                    name: 'DIA photometry data points',
                    notes: '<ul class="list-disc list-outside px-5">' +
                        '<li>Fixed centroid, and floating centroid</li>' +
                        '<li>Against 8 day stack from first week of season (challenges here— proper motion over' +
                        ' season, if the thing was already changing during stack [long duration event], bad DIA)</li>' +
                        '</ul>'
                },
            ]
        },
    },
    {
        sourcePipeline: pipelineNodeDefinitions.socPipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline, pipelineNodeDefinitions.workingGroup13Pipeline,
            pipelineNodeDefinitions.workingGroup5Pipeline],
        data: {
            name: 'Photometric light curves',
            unit: 'For each event target and nearby targets',
            structure: 'Table of (x, y, flux/mag, xerr, yerr, magerr, t) for all time steps, all filters, ' +
                'cross-matched across all seasons',
        },
    },
    {
        sourcePipeline: pipelineNodeDefinitions.socPipeline,
        destinationPipelines: [pipelineNodeDefinitions.differenceImageAnalysisPipeline],
        data: {
            name: 'Difference images',
        },
    },
    {
        sourcePipeline: pipelineNodeDefinitions.differenceImageAnalysisPipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup11Pipeline],
        data: {
            name: 'Difference image analysis',
        },
    },
    {
        sourcePipeline: pipelineNodeDefinitions.lensFluxAnalysisPipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline],
        data: {name: 'Photometric light curves'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup13Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.Public],
        data: {
            name: 'Joint photometric and astrometric fit of model',
            unit: 'For each event',
            notes: 'Containing proper motion + parallax + microlensing.',
            dataElements: [
                {
                    name: 'Posterior states',
                    structure: 'Table of (parameter values [which parameters?], likelihood, prior probability, weight)',
                },
                {
                    name: 'Best-fit quantities and uncertainties from fit',
                    structure: '(parameter values [which parameters?], likelihood, prior probability, weight)',
                    notes: 'Need details here: multi-modal? maxL/MAP/mean/median',
                },
                {
                    name: 'Evidence from fit',
                    notes: 'Needed for model comparisons.',
                },
            ]
        }
    },
    {
        sourcePipeline: pipelineNodeDefinitions.msosModelingPipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup13Pipeline],
        data: {name: 'Astrometric estimate data'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup11Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.Public],
        data: {
            name: 'Free-floating planet catalog',
            isOfficialPitPublicDataProduct: true,
            host: 'MAST',
            totalDataSize: '18GB',
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
    },
];

dataFlows.forEach(dataFlow => {
    createDataFlowDefinitionAndAppendToElementDefinitions(dataFlow, elementDefinitions);
});
export {elementDefinitions};
