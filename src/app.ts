import type { Core } from "cytoscape";
import { NodeTypeStyleClass } from "./graphTypes";
import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';
import { elementDefinitions } from "./elementEntries";
import type { NodeCollection, EventObject } from "cytoscape";
import defaultGlobalViewNodePositionsJson from './default_global_positions.json';

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

const GlobalViewLayout = {
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
    savePositionsButton: HTMLElement

    constructor(cy: Core) {
        this.cy = cy
        this.loadNodePositions()
        this.view = ViewType.GlobalView
        this.backButton = document.getElementById('back_button')!
        this.savePositionsButton = document.getElementById('save_positions_button')!

        cy.on('tap', 'node', (event) => this.onclickDispatcher(event))
        this.backButton.addEventListener('click', () => this.backButtonCallback())
        this.savePositionsButton.addEventListener('click', () => this.saveNodePositions())
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

    backButtonCallback() {
        this.setGlobalView()
    }

    setGlobalView() {
        console.log('back start')
        let allElements = this.cy.elements()
        allElements.style('display', 'element')
        allElements.layout(GlobalViewLayout).run()
        this.cy.fit(allElements, 10)
        this.backButton.style.display = 'none'
    }

    turnOnNodePositionSaving() {
        this.cy.nodes().on('position', () => {

        })
    }

    // TODO: Clean AI code.
    saveNodePositions() {
        const positions: Record<string, { x: number, y: number }> = {};
        this.cy.nodes().forEach(node => {
            positions[node.id()] = node.position();
        });
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(positions, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "default_global_positions.json");
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
    }

    // TODO: Clean AI code.
    loadNodePositions() {
        console.log('Start node positions.')
        const defaultGlobalViewNodePositions: Record<string, { x: number, y: number }> = defaultGlobalViewNodePositionsJson;
        this.cy.nodes().forEach(node => {
            console.log(node.id())
            const pos = defaultGlobalViewNodePositions[node.id()];
            if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
                node.position(pos);
                console.log('Positioned node.')
            }
        });
        this.cy.fit(this.cy.elements(), 10);
        console.log('End node positions.')
    }
}
