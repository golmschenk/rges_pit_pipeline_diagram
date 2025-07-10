import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import {NodeTypeStyleClass} from "./graphTypes.ts";
import {elements} from "./elementEntries.ts";

cytoscape.use(dagre);
cytoscape({
    container: document.getElementById('main'),
    elements: elements,
    style: [
        {
            selector: 'node',
            style: {
                label: 'data(name)',
                width: '180',
                height: '90',
                'text-valign': 'center',
                'text-halign': 'center',
                'text-wrap': 'wrap',
                'text-max-width': '140',
                'border-width': '1px',
                'border-style': 'solid',
                'border-color': '#000000',
                'font-size': '16px',
            }
        },
        {
            selector: `.${NodeTypeStyleClass.WorkingGroup}`,
            style: {
                shape: 'rectangle',
                'background-color': '#C0BFFB',
            },
        },
        {
            selector: `.${NodeTypeStyleClass.ExternalGroup}`,
            style: {
                shape: 'rectangle',
                'background-color': '#CCCCCC',
            },
        },
        {
            selector: `.${NodeTypeStyleClass.DataProduct}`,
            style: {
                shape: 'rectangle',
                'background-color': '#F6C1FC',
            },
        },
        {
            selector: `.${NodeTypeStyleClass.Data}`,
            style: {
                shape: 'round-rectangle',
                'corner-radius' : '20px',
                'background-color': '#CCFEC6',
            },
        },
        {
            selector: 'edge',
            style: {
                'width': 1.2,
                'line-color': '#000000',
                'target-arrow-color': '#000000',
                'target-arrow-shape': 'triangle',
                'arrow-scale': 1.2,
                'line-cap': 'square',
                'curve-style': 'bezier',
            }
        },
    ],

    layout: {
        name: 'dagre',
        // @ts-ignore
        rankDir: 'LR',
    }
});

// let x = cy.edges()[0]
// let loopAnimation = (edge: cytoscape.EdgeSingular, iteration: number) => {
//     const offset = {
//         style: {
//             "line-dash-offset": 24,
//             "line-dash-pattern": [8, 4],
//         }
//     }
//     const duration = { duration: 1000 };
//     return edge.animation({offset, duration}).play()
//         .promise('complete')
//         .then(() => loopAnimation(edge, iteration + 1));
//     );
//
//     ani.reverse().play().promise('complete').then(() => loopAnimation(elements))
// };
