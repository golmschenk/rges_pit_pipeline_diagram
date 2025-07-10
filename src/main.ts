import cytoscape, {type ElementDefinition, type NodeDefinition, type EdgeDefinition} from 'cytoscape';
import dagre from 'cytoscape-dagre';
import {v4 as uuid} from 'uuid';
import type {Brand} from "./brand.ts";

type GroupNode = Brand<NodeDefinition, 'GroupNode'>
type DataNode = Brand<NodeDefinition, 'DataNode'>
type DataFlowEdge = Brand<EdgeDefinition, 'DataFlowEdge'>

function createGroupNode(name: string): GroupNode {
    return {
        group: 'nodes',
        data: {
            id: uuid(),
            name: name,
        },
        __brand: 'GroupNode',
    };
}

function createDataNode(name: string): DataNode {
    return {
        group: 'nodes',
        data: {
            id: uuid(),
            name: name,
        },
        __brand: 'DataNode',
    };
}

function createDataFlowEdge(sourceNode: NodeDefinition, destinationNode: NodeDefinition): DataFlowEdge {
    return {
        group: 'edges',
        data: {
            id: uuid(),
            source: sourceNode.data.id!,
            target: destinationNode.data.id!,
        },
        __brand: 'DataFlowEdge',
    };
}

function createDataFlow(dataName: string, sourceGroupNode: GroupNode, destinationGroupNodes: GroupNode[]): [DataNode, DataFlowEdge[]] {
    const dataNode = createDataNode(dataName)
    const dataFlowEdges: DataFlowEdge[] = []
    const dataFlowEdge = createDataFlowEdge(sourceGroupNode, dataNode)
    dataFlowEdges.push(dataFlowEdge)
    destinationGroupNodes.forEach((destinationGroupNode) => {
        const dataFlowEdge = createDataFlowEdge(dataNode, destinationGroupNode)
        dataFlowEdges.push(dataFlowEdge)
    })
    return [dataNode, dataFlowEdges]
}

function createDataFlowAndAppendToElements(dataName: string, sourceGroupNode: GroupNode, destinationGroupNodes: GroupNode[], elements: ElementDefinition[]): void {
    const [dataNode, dataFlowEdges] = createDataFlow(dataName, sourceGroupNode, destinationGroupNodes)
    elements.push(dataNode, ...dataFlowEdges);
}

type GroupNodes = {
    workingGroup1Node: GroupNode,
    workingGroup2Node: GroupNode,
    workingGroup3Node: GroupNode,
    workingGroup4Node: GroupNode,
    workingGroup5Node: GroupNode,
    workingGroup6Node: GroupNode,
    workingGroup7Node: GroupNode,
    workingGroup8Node: GroupNode,
    workingGroup9Node: GroupNode,
    workingGroup10Node: GroupNode,
    workingGroup11Node: GroupNode,
    workingGroup12Node: GroupNode,
    workingGroup13Node: GroupNode,
    workingGroup14Node: GroupNode,
    dataProductGroupNode: GroupNode,
    msosPhotometryGroupNode: GroupNode,
    msosModelingGroupNode: GroupNode,
}

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
    dataProductGroupNode: createGroupNode('Data Product'),
    msosPhotometryGroupNode: createGroupNode('MSOS Photometry'),
    msosModelingGroupNode: createGroupNode('MSOS Modeling'),
}

let elements: ElementDefinition[] = [groupNodes.workingGroup3Node, groupNodes.workingGroup4Node, groupNodes.workingGroup5Node, groupNodes.workingGroup7Node, groupNodes.workingGroup12Node, groupNodes.dataProductGroupNode];
createDataFlowAndAppendToElements('Source and Lens position and brightness posteriors', groupNodes.workingGroup4Node, [groupNodes.workingGroup3Node], elements)
createDataFlowAndAppendToElements('Simulated light curves', groupNodes.workingGroup7Node, [groupNodes.workingGroup3Node], elements)
createDataFlowAndAppendToElements('New candidate microlensing events and anomalies', groupNodes.workingGroup5Node, [groupNodes.workingGroup3Node], elements)
createDataFlowAndAppendToElements('Planetary and binary microlensing event posteriors', groupNodes.workingGroup3Node, [groupNodes.workingGroup12Node], elements)
createDataFlowAndAppendToElements('Posteriors of microlensing properties of all events', groupNodes.workingGroup3Node, [groupNodes.dataProductGroupNode], elements)
createDataFlowAndAppendToElements('Table of microlensing properties of all events', groupNodes.workingGroup3Node, [groupNodes.dataProductGroupNode], elements)

cytoscape.use(dagre);
// @ts-ignore
// @ts-ignore
const cy = cytoscape({
    container: document.getElementById('main'),
    elements: elements,
    style: [
        {
            selector: 'node',
            style: {
                label: 'data(name)',
                shape: 'round-rectangle',
                width: '200',
                height: '100',
                'text-valign': 'center',
                'text-halign': 'center',
                'text-wrap': 'wrap',
                'text-max-width': '190',
                'background-color': '#ddd',
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'line-cap': 'square',
                'curve-style': 'bezier',
            }
        }
    ],

    layout: {
        name: 'dagre',
        // @ts-ignore
        rankDir: 'LR',
    }
});
