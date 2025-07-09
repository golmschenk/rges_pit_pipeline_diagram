import cytoscape from 'cytoscape';

// Define interfaces for our data structures
interface NodeData {
    id: string;
}

interface EdgeData extends NodeData {
    source: string;
    target: string;
}

interface ElementData {
    data: NodeData | EdgeData;
}

// Create the cytoscape instance
cytoscape({
    container: document.getElementById('main'), // container to render in

    elements: [ // list of graph elements to start with
        { // node a
            data: { id: 'a' }
        },
        { // node b
            data: { id: 'b' }
        },
        { // edge ab
            data: { id: 'ab', source: 'a', target: 'b' }
        }
    ] as ElementData[],

    style: [ // the stylesheet for the graph
        {
            selector: 'node',
            style: {
                'background-color': '#666',
                'label': 'data(id)'
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