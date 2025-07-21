import type { Core } from "cytoscape";
import { NodeTypeStyleClass } from "./graphTypes";
import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';
import { elementDefinitions } from "./elementEntries";
import type { NodeCollection, EventObject } from "cytoscape";

function getNodesForGroupFocus(workingGroupId: string, cy: Core): NodeCollection {
    let focusWorkingGroup = cy.getElementById(workingGroupId)
    let inputs = focusWorkingGroup.incomers(`.${NodeTypeStyleClass.Data}`)
    let sources = inputs.incomers(`.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}, .${NodeTypeStyleClass.DataProduct}`)
    let outputs = focusWorkingGroup.outgoers(`.${NodeTypeStyleClass.Data}`)
    let destinations = outputs.outgoers(`.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}, .${NodeTypeStyleClass.DataProduct}`)
    return focusWorkingGroup.union(inputs).union(sources).union(outputs).union(destinations)
}

const workingGroupFocusLayout = {
    name: 'dagre',
    // @ts-ignore
    rankDir: 'LR',
};

export const ViewType = {
    GlobalView: 'GlobalView',
    GroupFocusView: 'GroupFocusView',
} as const;
export type ViewType = typeof ViewType[keyof typeof ViewType];

export class App {
    cy: Core
    view: ViewType
    backButton: HTMLElement

    constructor(cy: Core) {
        this.cy = cy
        this.view = ViewType.GlobalView
        this.backButton = document.getElementById('back_button')!

        cy.on('tap', 'node', (event) => this.onclickDispatcher(event))
        
    }

    static create(): App {
        cytoscape.use(dagre);
        let cy = cytoscape({
            container: document.getElementById('cytoscape_container'),
            elements: elementDefinitions,
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
                        'corner-radius': '20px',
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

            layout: workingGroupFocusLayout
        });

        return new App(cy)
    }

    setGroupFocusView(groupNodeId: string) {
        let allElements = this.cy.elements()
        allElements.style('display', 'none')
        let activeNodes = getNodesForGroupFocus(groupNodeId, this.cy)
        let activeEdges = activeNodes.edgesWith(activeNodes)
        let activeElements = activeNodes.union(activeEdges)
        activeElements.style('display', 'element')
        activeElements.layout(workingGroupFocusLayout).run()
        this.cy.fit(activeElements, 10)
    }

    onclickDispatcher(event: EventObject) {
        let targetElement = event.target
        if (targetElement.isNode()) {
            if (targetElement.hasClass(NodeTypeStyleClass.WorkingGroup)) {
                this.setGroupFocusView(event.target.id())
                this.view = ViewType.GroupFocusView
                this.backButton.style.display = 'inline'
            }
            if (targetElement.hasClass(NodeTypeStyleClass.Data)) {
                console.log('Data') // TODO: This works.
            }
        }
    }
}
