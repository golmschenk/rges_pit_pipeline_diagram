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
}

let elementDefinitions: ElementDefinition[] = Object.values(groupNodeDefinitions);

const dataFlows: DataFlowData[] = [
    {
        sourceGroup: groupNodeDefinitions.workingGroup4,
        destinationGroups: [groupNodeDefinitions.workingGroup3],
        data: {description: 'Source and Lens position and brightness posteriors'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup7,
        destinationGroups: [groupNodeDefinitions.workingGroup3],
        data: {description: 'Simulated light curves'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup5,
        destinationGroups: [groupNodeDefinitions.workingGroup3],
        data: {description: 'New candidate microlensing events and anomalies'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup3,
        destinationGroups: [groupNodeDefinitions.workingGroup12],
        data: {description: 'Planetary and binary microlensing event posteriors'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup3,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {description: 'Posteriors of microlensing properties of all events'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup3,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {description: 'Table of microlensing properties of all events'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup8,
        destinationGroups: [groupNodeDefinitions.workingGroup4],
        data: {description: 'Precursor HST and Euclid images, photometry and astrometry'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup4,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {description: 'Table of lens flux properties of all events'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup4,
        destinationGroups: [groupNodeDefinitions.workingGroup11],
        data: {description: 'Difference image astrometry and photometry'},
    },
    {
        sourceGroup: groupNodeDefinitions.msosModelingGroup,
        destinationGroups: [groupNodeDefinitions.workingGroup3, groupNodeDefinitions.workingGroup12],
        data: {description: 'Automated light curve modeling results'},
    },
    {
        sourceGroup: groupNodeDefinitions.msosModelingGroup,
        destinationGroups: [groupNodeDefinitions.workingGroup12],
        data: {description: 'Single lens events'},
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup6,
        destinationGroups: [groupNodeDefinitions.msosPhotometryGroup],
        data: {description: 'Variable star models'},
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup6,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {description: 'Simulated variable star light curves'},
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup7,
        destinationGroups: [groupNodeDefinitions.workingGroup12],
        data: {description: 'Galaxy models and stellar microlensing occurrence rate predictions'},
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup12,
        destinationGroups: [groupNodeDefinitions.workingGroup7],
        data: {description: 'Detection efficiency corrected rates for stellar microlensing events to update Galactic models'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup7,
        destinationGroups: [groupNodeDefinitions.workingGroup9],
        data: {description: 'Simulated images and light curves'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup9,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {description: 'Data challenges'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup9,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {description: 'Outreach material (data sonifications, etc.)'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup10,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {description: 'Jupyter Notebooks and lectures'}
    },
    {
        sourceGroup: groupNodeDefinitions.msosPhotometryGroup,
        destinationGroups: [groupNodeDefinitions.workingGroup3, groupNodeDefinitions.workingGroup13],
        data: {
            description: 'Photometric light curves',
            unit: 'For each event target and nearby targets',
            structure: 'Table of (x, y, flux/mag, xerr, yerr, magerr, t) for all time steps, all filters, ' +
                'cross-matched across all seasons',
        },
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup4,
        destinationGroups: [groupNodeDefinitions.workingGroup3],
        data: {description: 'Photometric light curves'}
    },
    {
        sourceGroup: groupNodeDefinitions.workingGroup13,
        destinationGroups: [groupNodeDefinitions.dataProductGroup],
        data: {
            description: 'Joint photometric and astrometric fit of model containing proper motion + parallax ' +
                '+ microlensing',
            unit: 'For each event',
            dataElements: [
                {
                    description: 'Posterior states',
                    structure: 'Table of (parameter values [which parameters?], likelihood, prior probability, weight)',
                },
                {
                    description: 'Best-fit quantities and uncertainties from fit [need details here: multi-modal? ' +
                        'maxL/MAP/mean/median]',
                    structure: 'Table of (parameter values [which parameters?], likelihood, prior probability, weight)',
                },
                {
                    description: 'Evidence from fit (needed for model comparisons)',
                },
            ]
        }
    },
    {
        sourceGroup: groupNodeDefinitions.msosModelingGroup,
        destinationGroups: [groupNodeDefinitions.workingGroup13],
        data: {description: 'Astrometric estimate data'}
    },
];

dataFlows.forEach(dataFlow => {
    createDataFlowDefinitionAndAppendToElementDefinitions(dataFlow, elementDefinitions);
});
export {elementDefinitions};
