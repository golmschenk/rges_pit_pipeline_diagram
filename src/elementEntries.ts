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
        data: {name: 'Source and Lens position and brightness posteriors'},
        sourceGroup: groupNodeDefinitions.workingGroup4,
        destinationGroups: [groupNodeDefinitions.workingGroup3]
    },
    {
        data: {name: 'Simulated light curves'},
        sourceGroup: groupNodeDefinitions.workingGroup7,
        destinationGroups: [groupNodeDefinitions.workingGroup3]
    },
    {
        data: {name: 'New candidate microlensing events and anomalies'},
        sourceGroup: groupNodeDefinitions.workingGroup5,
        destinationGroups: [groupNodeDefinitions.workingGroup3]
    },
    {
        data: {name: 'Planetary and binary microlensing event posteriors'},
        sourceGroup: groupNodeDefinitions.workingGroup3,
        destinationGroups: [groupNodeDefinitions.workingGroup12]
    },
    {
        data: {name: 'Posteriors of microlensing properties of all events'},
        sourceGroup: groupNodeDefinitions.workingGroup3,
        destinationGroups: [groupNodeDefinitions.dataProductGroup]
    },
    {
        data: {name: 'Table of microlensing properties of all events'},
        sourceGroup: groupNodeDefinitions.workingGroup3,
        destinationGroups: [groupNodeDefinitions.dataProductGroup]
    },
    {
        data: {name: 'Precursor HST and Euclid images, photometry and astrometry'},
        sourceGroup: groupNodeDefinitions.workingGroup8,
        destinationGroups: [groupNodeDefinitions.workingGroup4]
    },
    {
        data: {name: 'Table of lens flux properties of all events'},
        sourceGroup: groupNodeDefinitions.workingGroup4,
        destinationGroups: [groupNodeDefinitions.dataProductGroup]
    },
    {
        data: {name: 'Difference image astrometry and photometry'},
        sourceGroup: groupNodeDefinitions.workingGroup4,
        destinationGroups: [groupNodeDefinitions.workingGroup11]
    },
    {
        data: {name: 'Automated light curve modeling results'},
        sourceGroup: groupNodeDefinitions.msosModelingGroup,
        destinationGroups: [groupNodeDefinitions.workingGroup3]
    },
    {
        data: {name: 'Single lens events'},
        sourceGroup: groupNodeDefinitions.msosModelingGroup,
        destinationGroups: [groupNodeDefinitions.workingGroup12]
    },
    {
        data: {name: 'Variable star models'},
        sourceGroup: groupNodeDefinitions.workingGroup6,
        destinationGroups: [groupNodeDefinitions.msosPhotometryGroup]
    },
    {
        data: {name: 'Simulated variable star light curves'},
        sourceGroup: groupNodeDefinitions.workingGroup6,
        destinationGroups: [groupNodeDefinitions.dataProductGroup]
    },
    {
        data: {name: 'Simulated variable star light curves'},
        sourceGroup: groupNodeDefinitions.workingGroup6,
        destinationGroups: [groupNodeDefinitions.dataProductGroup]
    },
    {
        data: {name: 'Galaxy models and stellar microlensing occurrence rate predictions'},
        sourceGroup: groupNodeDefinitions.workingGroup7,
        destinationGroups: [groupNodeDefinitions.workingGroup12]
    },
    {
        data: {name: 'Detection efficiency corrected rates for stellar microlensing events to update Galactic models'},
        sourceGroup: groupNodeDefinitions.workingGroup12,
        destinationGroups: [groupNodeDefinitions.workingGroup7]
    },
    {
        data: {name: 'Simulated images and light curves'},
        sourceGroup: groupNodeDefinitions.workingGroup7,
        destinationGroups: [groupNodeDefinitions.workingGroup9]
    },
    {
        data: {name: 'Data challenges'},
        sourceGroup: groupNodeDefinitions.workingGroup9,
        destinationGroups: [groupNodeDefinitions.dataProductGroup]
    },
    {
        data: {name: 'Outreach material (data sonifications, etc.)'},
        sourceGroup: groupNodeDefinitions.workingGroup9,
        destinationGroups: [groupNodeDefinitions.dataProductGroup]
    },
    {
        data: {name: 'Jupyter Notebooks and lectures'},
        sourceGroup: groupNodeDefinitions.workingGroup10,
        destinationGroups: [groupNodeDefinitions.dataProductGroup]
    },
];

dataFlows.forEach(dataFlow => {
    createDataFlowDefinitionAndAppendToElementDefinitions(dataFlow, elementDefinitions);
});
export {elementDefinitions};
