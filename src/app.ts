import type {Core, EdgeCollection, EdgeSingular, SingularAnimationOptionsBase} from 'cytoscape';
import {NodeTypeStyleClass} from './graphTypes';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import {elementDefinitions} from './elementEntries';
import type {NodeCollection, EventObject} from 'cytoscape';
import defaultGlobalViewNodePositionsJson from './default_global_positions.json';

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


async function marchingAntsAnimationForEdges(edges: EdgeCollection) {
    // TODO: There appears to be a small jitter on each iteration. The 10 second duration is probably an ok fix, but
    //       figuring out how to actually make it smooth might be better.
    const speed = 300
    const duration = 10000
    let step = 0
    while (true) {
        step += 1
        const style = {
            'line-dash-pattern': [10, 10],
            'line-dash-offset': -speed * step,
        }
        await new Promise<void>((resolve) => {
            edges.animate({
                style: style,
                duration: duration,
                complete: () => resolve()
            });
        });
    }
}

function updateNodeDimensions(node: cytoscape.NodeSingular) {
    const minimumWidth = 180;
    const minimumHeight = 90;
    const padding = 0;
    const bbox = node.boundingBox({
        includeLabels: true,
        includeOverlays: false
    });
    const width = Math.max(minimumWidth, bbox.w + padding);
    const height = Math.max(minimumHeight, bbox.h + padding);
    node.data('width', width);
    node.data('height', height);
}


export class App {
    cy: Core
    view: ViewType
    backButton: HTMLElement
    savePositionsButton: HTMLElement

    constructor(cy: Core) {
        this.cy = cy
        this.view = ViewType.GlobalView
        this.backButton = document.getElementById('back_button')!
        this.savePositionsButton = document.getElementById('save_positions_button')!
        this.setGlobalView()
        this.cy.nodes().forEach(node => updateNodeDimensions(node));

        cy.on('tap', 'node', (event) => this.onclickDispatcher(event))
        this.backButton.addEventListener('click', () => this.backButtonCallback())
        this.savePositionsButton.addEventListener('click', () => this.saveNodePositions())
        this.animateEdges()
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
                        width: 'data(width)',
                        height: 'data(height)',
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
                        // 'source-arrow-color': '#000000',
                        // 'source-arrow-shape': 'circle',
                        'arrow-scale': 1.2,
                        'line-cap': 'square',
                        'curve-style': 'bezier',
                        'line-style': 'dashed',
                        'line-dash-pattern': [10, 10],
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
        let focusWorkingGroup = this.cy.getElementById(groupNodeId)
        let inputs = focusWorkingGroup.incomers(`.${NodeTypeStyleClass.Data}`)
        let sources = inputs.incomers(
            `.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}, 
            .${NodeTypeStyleClass.DataProduct}`)
        let outputs = focusWorkingGroup.outgoers(`.${NodeTypeStyleClass.Data}`)
        let destinations = outputs.outgoers(
            `.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}, 
            .${NodeTypeStyleClass.DataProduct}`)
        let activeNodes = focusWorkingGroup.union(inputs).union(sources).union(outputs).union(destinations)
        let activeEdges = sources.edgesTo(inputs).union(inputs.edgesTo(focusWorkingGroup))
            .union(focusWorkingGroup.edgesTo(outputs)).union(outputs.edgesTo(destinations))
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
        let allElements = this.cy.elements()
        allElements.style('display', 'none')
        let globalViewNodes = this.cy.nodes().not(`.${NodeTypeStyleClass.DataProduct}`)
        let globalViewElements = globalViewNodes.union(globalViewNodes.edgesWith(globalViewNodes))
        globalViewElements.style('display', 'element')
        this.loadNodePositions()
        this.cy.fit(globalViewElements, 10)
        this.backButton.style.display = 'none'
    }

    saveNodePositions() {
        const positions: Record<string, { x: number, y: number }> = {};
        this.cy.nodes().forEach(node => {
            positions[node.id()] = node.position();
        });
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
            JSON.stringify(positions, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', 'default_global_positions.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    loadNodePositions() {
        const defaultGlobalViewNodePositions: Record<string, {
            x: number,
            y: number
        }> = defaultGlobalViewNodePositionsJson;
        this.cy.nodes().forEach(node => {
            const position = defaultGlobalViewNodePositions[node.id()];
            if (position && typeof position.x === 'number' && typeof position.y === 'number') {
                node.position(position);
            }
        });
        this.cy.fit(this.cy.elements(), 10);
    }

    animateEdges() {
        marchingAntsAnimationForEdges(this.cy.edges())
    }
}
