import {type GroupNodesDefinitions, GroupType} from "./graphTypes.ts";
import {createDataFlowDefinitionAndAppendToElementDefinitions, createGroupNodeDefinition} from "./graphFactories.ts";
import type {ElementDefinition} from "cytoscape";
import type {DataFlowData} from "./graphTypes.ts";

export const groupNodeDefinitions: GroupNodesDefinitions = {
    workingGroup1: createGroupNodeDefinition('WG #1: Leadership and Project Management'),
    workingGroup2: createGroupNodeDefinition('WG #2: Education, Outreach, and Community'),
    workingGroup3: createGroupNodeDefinition('WG #3: Event Modeling'),
    workingGroup4: createGroupNodeDefinition('WG #4: Lens Flux Analysis'),
    workingGroup5: createGroupNodeDefinition('WG #5: Event and Anomaly Detection'),
    workingGroup6: createGroupNodeDefinition('WG #6: Variable Stars'),
    workingGroup7: createGroupNodeDefinition('WG #7: Survey Simulations and Pipeline Validation'),
    workingGroup8: createGroupNodeDefinition('WG #8: Contemporaneous and Precursor Observations'),
    workingGroup9: createGroupNodeDefinition('WG #9: Data Challenges, Outreach, and Citizen Science'),
    workingGroup10: createGroupNodeDefinition('WG #10: Microlensing Mini-Courses'),
    workingGroup11: createGroupNodeDefinition('WG #11: Free Floating Planets'),
    workingGroup12: createGroupNodeDefinition('WG #12: Efficiency and Occurrence Rate Analysis'),
    workingGroup13: createGroupNodeDefinition('WG #13: Astrometry'),
    workingGroup14: createGroupNodeDefinition('WG #14: Global Pipeline'),
    dataProductGroup: createGroupNodeDefinition('Data Product', GroupType.DataProduct),
    msosPhotometryGroup: createGroupNodeDefinition('MSOS Photometry', GroupType.ExternalGroup),
    msosModelingGroup: createGroupNodeDefinition('MSOS Modeling', GroupType.ExternalGroup),
    socGroup: createGroupNodeDefinition('SOC', GroupType.ExternalGroup),
}

let elementDefinitions: ElementDefinition[] = Object.values(groupNodeDefinitions);

const dataFlows: DataFlowData[] = [
    {
        sourceGroup: groupNodeDefinitions.workingGroup4,
        destinationGroups: [groupNodeDefinitions.workingGroup3],
        data: {name: 'Source and Lens position and brightness posteriors'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup7,
        destinationGroups: [groupNodeDefinitions.workingGroup3],
        data: {name: 'Simulated light curves'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup5,
        destinationGroups: [groupNodeDefinitions.workingGroup3],
        data: {name: 'New candidate microlensing events and anomalies'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup3,
        destinationGroups: [groupNodeDefinitions.workingGroup12],
        data: {name: 'Planetary and binary microlensing event posteriors'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup3,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {name: 'Posteriors of microlensing properties of all events'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup3,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {name: 'Table of microlensing properties of all events'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup8,
        destinationGroups: [groupNodeDefinitions.workingGroup4],
        data: {name: 'Precursor HST and Euclid images, photometry and astrometry'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup4,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {name: 'Table of lens flux properties of all events'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup4,
        destinationGroups: [groupNodeDefinitions.workingGroup11],
        data: {name: 'Difference image astrometry and photometry'},
    },
    {
        sourceGroup: groupNodeDefinitions.msosModelingGroup,
        destinationGroups: [groupNodeDefinitions.workingGroup3, groupNodeDefinitions.workingGroup12],
        data: {name: 'Automated light curve modeling results'},
    },
    {
        sourceGroup: groupNodeDefinitions.msosModelingGroup,
        destinationGroups: [groupNodeDefinitions.workingGroup12],
        data: {name: 'Single lens events'},
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup6,
        destinationGroups: [groupNodeDefinitions.msosPhotometryGroup],
        data: {name: 'Variable star models'},
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup6,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {name: 'Simulated variable star light curves'},
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup7,
        destinationGroups: [groupNodeDefinitions.workingGroup12],
        data: {name: 'Galaxy models and stellar microlensing occurrence rate predictions'},
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup12,
        destinationGroups: [groupNodeDefinitions.workingGroup7],
        data: {name: 'Detection efficiency corrected rates for stellar microlensing events to update Galactic models'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup7,
        destinationGroups: [groupNodeDefinitions.workingGroup9],
        data: {name: 'Simulated images and light curves'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup9,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {name: 'Data challenges'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup9,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {name: 'Outreach material (data sonifications, etc.)'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup10,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {name: 'Jupyter Notebooks and lectures'}
    },
    {
        sourceGroup: groupNodeDefinitions.msosPhotometryGroup,
        destinationGroups: [groupNodeDefinitions.socGroup],
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
        sourceGroup: groupNodeDefinitions.socGroup,
        destinationGroups: [groupNodeDefinitions.workingGroup3, groupNodeDefinitions.workingGroup13],
        data: {
            name: 'Photometric light curves',
            unit: 'For each event target and nearby targets',
            structure: 'Table of (x, y, flux/mag, xerr, yerr, magerr, t) for all time steps, all filters, ' +
                'cross-matched across all seasons',
        },
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup4,
        destinationGroups: [groupNodeDefinitions.workingGroup3],
        data: {name: 'Photometric light curves'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup13,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
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
        sourceGroup: groupNodeDefinitions.msosModelingGroup,
        destinationGroups: [groupNodeDefinitions.workingGroup13],
        data: {name: 'Astrometric estimate data'}
    },
];

dataFlows.forEach(dataFlow => {
    createDataFlowDefinitionAndAppendToElementDefinitions(dataFlow, elementDefinitions);
});
export {elementDefinitions};
