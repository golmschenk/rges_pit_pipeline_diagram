import cytoscape, {type ElementDefinition, type NodeDefinition, type EdgeDefinition} from 'cytoscape';
import {v4 as uuid} from 'uuid';

function createWorkingGroupNode(name: string): NodeDefinition {

    return {
        group: 'nodes',
        data: {
            id: uuid(),
            name: name,
        },
    };
}
const workingGroup3Node: NodeDefinition = createWorkingGroupNode('WG #3: Event Modeling')
const workingGroup4Node: NodeDefinition = createWorkingGroupNode('WG #4: Lens Flux Analysis')
const workingGroup7Node: NodeDefinition = createWorkingGroupNode('WG #7: Survey Simulations and Pipeline Validation');
const workingGroup5Node: NodeDefinition = createWorkingGroupNode('WG #5: Event and Anomaly Detection')


const dataFlowEdges: EdgeDefinition[] = [
    {
        group: 'edges',
        data: {
            id: uuid(),
            source: workingGroup7Node.data.id!,
            target: workingGroup3Node.data.id!,
        }
    }
];

let elements: ElementDefinition[] = [workingGroup3Node, workingGroup4Node, workingGroup5Node, workingGroup7Node];
elements = elements.concat(dataFlowEdges);

cytoscape({
    container: document.getElementById('main'),
    elements: elements,
    style: [
        {
            selector: 'node',
            style: {
                label: 'data(name)',
                'background-color': '#666',
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