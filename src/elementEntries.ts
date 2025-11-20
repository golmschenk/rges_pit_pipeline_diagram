import {type PipelineNodeDefinitions, PipelineNodeType} from "./graphTypes.ts";
import {createDataFlowDefinitionAndAppendToElementDefinitions, createPipelineNodeDefinition} from "./graphFactories.ts";
import type {ElementDefinition} from "cytoscape";
import type {DataFlowData} from "./graphTypes.ts";

export const pipelineNodeDefinitions: PipelineNodeDefinitions = {
    workingGroup1Pipeline: createPipelineNodeDefinition('WG #1: Leadership and Project Management'),
    workingGroup2Pipeline: createPipelineNodeDefinition('WG #2: Education, Outreach, and Community'),
    workingGroup3Pipeline: createPipelineNodeDefinition('WG #3: Event Modeling'),
    workingGroup4Pipeline: createPipelineNodeDefinition('WG #4: Lens Flux Analysis'),
    workingGroup5Pipeline: createPipelineNodeDefinition('WG #5: Event and Anomaly Detection'),
    workingGroup6Pipeline: createPipelineNodeDefinition('WG #6: Variable Stars'),
    workingGroup7Pipeline: createPipelineNodeDefinition('WG #7: Survey Simulations and Pipeline Validation'),
    workingGroup8Pipeline: createPipelineNodeDefinition('WG #8: Contemporaneous and Precursor Observations'),
    workingGroup9Pipeline: createPipelineNodeDefinition('WG #9: Data Challenges, Outreach, and Citizen Science'),
    workingGroup10Pipeline: createPipelineNodeDefinition('WG #10: Microlensing Mini-Courses'),
    workingGroup11Pipeline: createPipelineNodeDefinition('WG #11: Free Floating Planets'),
    workingGroup12Pipeline: createPipelineNodeDefinition('WG #12: Efficiency and Occurrence Rate Analysis'),
    workingGroup13Pipeline: createPipelineNodeDefinition('WG #13: Astrometry'),
    workingGroup14Pipeline: createPipelineNodeDefinition('WG #14: Global Pipeline'),
    dataProduct: createPipelineNodeDefinition('Data Product', PipelineNodeType.DataProduct),
    msosPhotometryPipeline: createPipelineNodeDefinition('MSOS Photometry', PipelineNodeType.ExternalGroupPipeline),
    msosModelingPipeline: createPipelineNodeDefinition('MSOS Modeling', PipelineNodeType.ExternalGroupPipeline),
    socPipeline: createPipelineNodeDefinition('SOC', PipelineNodeType.ExternalGroupPipeline),
}

let elementDefinitions: ElementDefinition[] = Object.values(pipelineNodeDefinitions);

const dataFlows: DataFlowData[] = [
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup4Pipeline,
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
        destinationPipelines: [pipelineNodeDefinitions.workingGroup12Pipeline, pipelineNodeDefinitions.dataProduct],
        data: {
            name: 'Microlensing event properties',
            dataElements: [
                {
                    name: 'Posteriors',
                    unit: 'Per event for all events',
                    frequency: 'After detection of event, and re-run at end of season and end of mission (at least)',
                    latency: 'days (?)',
                    structure: '(parameter values [which parameters?], likelihood)',
                    format: 'Parquet'
                },
                {
                    name: 'Table for all events',
                    unit: 'For all detected events',
                    frequency: 'After each season',
                    structure: 'Columns with median properties (which properties?) with credible intervals',
                    notes: 'How different types of solutions (1S1L vs 2S1L) to be represented? Perhaps use a relation database instead of a single table?'
                },
            ],
        },
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup8Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup4Pipeline],
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
                    notes: 'Images are hosted and downloadable at SOC/ MAST.',
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
        sourcePipeline: pipelineNodeDefinitions.workingGroup4Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.dataProduct],
        data: {name: 'Table of lens flux properties of all events'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup4Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup11Pipeline],
        data: {name: 'Difference image astrometry and photometry'},
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
        destinationPipelines: [pipelineNodeDefinitions.dataProduct],
        data: {name: 'Simulated variable star light curves'},
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup7Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup12Pipeline],
        data: {name: 'Galaxy models and stellar microlensing occurrence rate predictions'},
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup12Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup7Pipeline],
        data: {name: 'Detection efficiency corrected rates for stellar microlensing events to update Galactic models'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup7Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup9Pipeline],
        data: {name: 'Simulated images and light curves'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup9Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.dataProduct],
        data: {name: 'Data challenges'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup9Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.dataProduct],
        data: {name: 'Outreach material (data sonifications, etc.)'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup10Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.dataProduct],
        data: {name: 'Jupyter Notebooks and lectures'}
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
        sourcePipeline: pipelineNodeDefinitions.workingGroup4Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.workingGroup3Pipeline],
        data: {name: 'Photometric light curves'}
    },
    {
        sourcePipeline: pipelineNodeDefinitions.workingGroup13Pipeline,
        destinationPipelines: [pipelineNodeDefinitions.dataProduct],
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
        destinationPipelines: [pipelineNodeDefinitions.dataProduct],
        data: {
            name: 'Free-floating planet catalog'
        }
    },
];

dataFlows.forEach(dataFlow => {
    createDataFlowDefinitionAndAppendToElementDefinitions(dataFlow, elementDefinitions);
});
export {elementDefinitions};
