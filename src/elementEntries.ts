import {type GroupNodesDefinitions, GroupType} from "./graphTypes.ts";
import {createDataFlowDefinitionAndAppendToElementDefinitions, createGroupNodeDefinition} from "./graphFactories.ts";
import type {ElementDefinition} from "cytoscape";
import type {DataFlowData} from "./graphTypes.ts";

const groupNodes: GroupNodesDefinitions = {
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

let elementDefinitions: ElementDefinition[] = Object.values(groupNodes);

const dataFlows: DataFlowData[] = [
    {
        data: {name: 'Source and Lens position and brightness posteriors'},
        sourceGroup: groupNodes.workingGroup4,
        destinationGroups: [groupNodes.workingGroup3]
    },
    {
        data: {name: 'Simulated light curves'},
        sourceGroup: groupNodes.workingGroup7,
        destinationGroups: [groupNodes.workingGroup3]
    },
    {
        data: {name: 'New candidate microlensing events and anomalies'},
        sourceGroup: groupNodes.workingGroup5,
        destinationGroups: [groupNodes.workingGroup3]
    },
    {
        data: {name: 'Planetary and binary microlensing event posteriors'},
        sourceGroup: groupNodes.workingGroup3,
        destinationGroups: [groupNodes.workingGroup12]
    },
    {
        data: {name: 'Posteriors of microlensing properties of all events'},
        sourceGroup: groupNodes.workingGroup3,
        destinationGroups: [groupNodes.dataProductGroup]
    },
    {
        data: {name: 'Table of microlensing properties of all events'},
        sourceGroup: groupNodes.workingGroup3,
        destinationGroups: [groupNodes.dataProductGroup]
    },
    {
        data: {name: 'Precursor HST and Euclid images, photometry and astrometry'},
        sourceGroup: groupNodes.workingGroup8,
        destinationGroups: [groupNodes.workingGroup4]
    },
];

dataFlows.forEach(dataFlow => {
    createDataFlowDefinitionAndAppendToElementDefinitions(dataFlow, elementDefinitions);
});
export {elementDefinitions};
