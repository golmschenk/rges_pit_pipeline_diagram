import { App } from './app.ts';

App.create()

// const groupNodeDefinition = groupNodeDefinitions.workingGroup3;
// app.setGroupFocusView(groupNodeDefinition);


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
