import {type GroupNodes, GroupType} from "./graphTypes.ts";
import {createDataFlowAndAppendToElements, createGroupNode} from "./graphFactories.ts";
import type {ElementDefinition} from "cytoscape";
import type {DataFlowData} from "./graphTypes.ts";

const groupNodes: GroupNodes = {
    workingGroup1Node: createGroupNode('WG #1: Leadership and Project Management'),
    workingGroup2Node: createGroupNode('WG #2: Education, Outreach, and Community'),
    workingGroup3Node: createGroupNode('WG #3: Event Modeling'),
    workingGroup4Node: createGroupNode('WG #4: Lens Flux Analysis'),
    workingGroup5Node: createGroupNode('WG #5: Event and Anomaly Detection'),
    workingGroup6Node: createGroupNode('WG #6: Variable Stars'),
    workingGroup7Node: createGroupNode('WG #7: Survey Simulations and Pipeline Validation'),
    workingGroup8Node: createGroupNode('WG #8: Contemporaneous and Precursor Observations'),
    workingGroup9Node: createGroupNode('WG #9: Data Challenges, Outreach, and Citizen Science'),
    workingGroup10Node: createGroupNode('WG #10: Microlensing Mini-Courses'),
    workingGroup11Node: createGroupNode('WG #11: Free Floating Planets'),
    workingGroup12Node: createGroupNode('WG #12: Efficiency and Occurrence Rate Analysis'),
    workingGroup13Node: createGroupNode('WG #13: Astrometry'),
    workingGroup14Node: createGroupNode('WG #14: Global Pipeline'),
    dataProductGroupNode: createGroupNode('Data Product', GroupType.DataProduct),
    msosPhotometryGroupNode: createGroupNode('MSOS Photometry', GroupType.ExternalGroup),
    msosModelingGroupNode: createGroupNode('MSOS Modeling', GroupType.ExternalGroup),
}

let elements: ElementDefinition[] = [groupNodes.workingGroup3Node, groupNodes.workingGroup4Node, groupNodes.workingGroup5Node, groupNodes.workingGroup7Node, groupNodes.workingGroup12Node, groupNodes.dataProductGroupNode];

const dataFlows: DataFlowData[] = [
    {
        data: {name: 'Source and Lens position and brightness posteriors'},
        sourceGroup: groupNodes.workingGroup4Node,
        destinationGroups: [groupNodes.workingGroup3Node]
    },
    {
        data: {name: 'Simulated light curves'},
        sourceGroup: groupNodes.workingGroup7Node,
        destinationGroups: [groupNodes.workingGroup3Node]
    },
    {
        data: {name: 'New candidate microlensing events and anomalies'},
        sourceGroup: groupNodes.workingGroup5Node,
        destinationGroups: [groupNodes.workingGroup3Node]
    },
    {
        data: {name: 'Planetary and binary microlensing event posteriors'},
        sourceGroup: groupNodes.workingGroup3Node,
        destinationGroups: [groupNodes.workingGroup12Node]
    },
    {
        data: {name: 'Posteriors of microlensing properties of all events'},
        sourceGroup: groupNodes.workingGroup3Node,
        destinationGroups: [groupNodes.dataProductGroupNode]
    },
    {
        data: {name: 'Table of microlensing properties of all events'},
        sourceGroup: groupNodes.workingGroup3Node,
        destinationGroups: [groupNodes.dataProductGroupNode]
    }
];

dataFlows.forEach(dataFlow => {
    createDataFlowAndAppendToElements(dataFlow, elements);
});
export {elements};
