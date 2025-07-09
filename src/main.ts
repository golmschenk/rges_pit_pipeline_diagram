import cytoscape, {type ElementDefinition, type NodeDefinition, type EdgeDefinition} from 'cytoscape';
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

const workingGroup3Node = createGroupNode('WG #3: Event Modeling')
const workingGroup4Node = createGroupNode('WG #4: Lens Flux Analysis')
const workingGroup7Node = createGroupNode('WG #7: Survey Simulations and Pipeline Validation');
const workingGroup5Node = createGroupNode('WG #5: Event and Anomaly Detection')

let elements: ElementDefinition[] = [workingGroup3Node, workingGroup4Node, workingGroup5Node, workingGroup7Node];
const [dataNode, dataFlowEdges] = createDataFlow('Source and Lens position and brightness posteriors', workingGroup4Node, [workingGroup3Node])
elements.push(dataNode);
elements = elements.concat(dataFlowEdges);


cytoscape({
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
                'text-valign':'center',
                'text-halign':'center',
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
                'curve-style': 'bezier'
            }
        }
    ],

    layout: {
        name: 'grid',
        rows: 1
    }
});