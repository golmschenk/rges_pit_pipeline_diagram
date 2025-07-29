import type {AnimationOptions, Collection, Core, EdgeCollection} from 'cytoscape';
import {NodeTypeStyleClass} from './graphTypes';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import {elementDefinitions} from './elementEntries';
import type {EventObject} from 'cytoscape';
import defaultGlobalViewNodePositionsJson from './default_global_positions.json';

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
                queue: false,
                complete: () => resolve()
            });
        });
    }
}

function updateNodeDimensions(node: cytoscape.NodeSingular) {
    const minimumWidth = 180;
    const minimumHeight = 90;
    const padding = 0;
    const bbox = node.boundingBox();
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
        this.setGlobalViewInstant()
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
                    selector: `.${NodeTypeStyleClass.DataFlow}`,
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
        });

        return new App(cy)
    }

    setGroupFocusView(groupNodeId: string) {
        const focusWorkingGroup = this.cy.getElementById(groupNodeId)
        const inputs = focusWorkingGroup.incomers(`.${NodeTypeStyleClass.DataFlow}`)
        const sources = inputs.incomers(
            `.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}, 
            .${NodeTypeStyleClass.DataProduct}`)
        const outputs = focusWorkingGroup.outgoers(`.${NodeTypeStyleClass.DataFlow}`)
        const destinations = outputs.outgoers(
            `.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}, 
            .${NodeTypeStyleClass.DataProduct}`)
        const activeNodes = focusWorkingGroup.union(inputs).union(sources).union(outputs).union(destinations)
        const activeEdges = sources.edgesTo(inputs).union(inputs.edgesTo(focusWorkingGroup))
            .union(focusWorkingGroup.edgesTo(outputs)).union(outputs.edgesTo(destinations))
        const activeElements = activeNodes.union(activeEdges)
        void this.animateChangeInActiveElements(activeElements)
        const layoutOptions = {
            name: 'dagre',
            // @ts-ignore
            rankDir: 'LR',
            fit: true,
            padding: 10.0,
            animate: true,
        }
        activeElements.layout(layoutOptions).run()
    }

    onclickDispatcher(event: EventObject) {
        let targetElement = event.target
        if (targetElement.isNode()) {
            if (targetElement.hasClass(NodeTypeStyleClass.WorkingGroup)) {
                this.setGroupFocusView(event.target.id())
                this.view = ViewType.GroupFocusView
                this.backButton.style.display = 'inline'
            }
        }
    }

    backButtonCallback() {
        this.setGlobalView()
    }

    setGlobalView() {
        this.backButton.style.display = 'none'
        const activeNodes = this.cy.nodes().not(`.${NodeTypeStyleClass.DataProduct}`)
        const activeElements = activeNodes.union(activeNodes.edgesWith(activeNodes))
        void this.animateChangeInActiveElements(activeElements)
        const positions = this.loadNodePositions()
        const layoutOptions = {
            name: 'preset',
            fit: true,
            padding: 10.0,
            animate: true,
            positions: positions,
        }
        activeElements.layout(layoutOptions).run()
    }

    setGlobalViewInstant() {
        this.backButton.style.display = 'none'
        const activeNodes = this.cy.nodes().filter(`.${NodeTypeStyleClass.WorkingGroup}, ` +
            `.${NodeTypeStyleClass.ExternalGroup}, .${NodeTypeStyleClass.DataFlow}`)
        const activeElements = activeNodes.union(activeNodes.edgesWith(activeNodes))
        activeElements.style({display: 'element', opacity: 1})
        const inactiveElements = this.cy.elements().difference(activeElements)
        inactiveElements.style({display: 'none', opacity: 1})
        const positions = this.loadNodePositions()
        const layoutOptions = {
            name: 'preset',
            fit: true,
            padding: 10.0,
            animate: false,
            positions: positions,
        }
        activeElements.layout(layoutOptions).run()
    }

    saveNodePositions() {
        const positions: Record<string, { x: number, y: number }> = {};
        this.cy.nodes().forEach(node => {
            positions[node.id()] = node.position();
        });
        const dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(
            JSON.stringify(positions, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataString);
        downloadAnchor.setAttribute('download', 'default_global_positions.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    loadNodePositions(): Record<string, { x: number, y: number }> {
        const defaultGlobalViewNodePositions: Record<string, {
            x: number,
            y: number,
        }> = defaultGlobalViewNodePositionsJson;
        const positions: Record<string, { x: number, y: number }> = {};
        this.cy.nodes().forEach(node => {
            let position = defaultGlobalViewNodePositions[node.id()];
            if (position && typeof position.x === 'number' && typeof position.y === 'number') {
                positions[node.id()] = {
                    x: roundToNearest10(position.x),
                    y: roundToNearest10(position.y)
                };
            }
        });
        return positions;
    }

    animateEdges() {
        void marchingAntsAnimationForEdges(this.cy.edges())
    }

    async animateChangeInActiveElements(activeElements: Collection) {
        void showElements(activeElements)
        const inactiveElements = this.cy.elements().difference(activeElements)
        // @ts-ignore
        const activeElementsStyle: SingularAnimationOptionsBase = {style: {opacity: 1}, duration: 500}
        // @ts-ignore
        const inactiveElementsStyle: SingularAnimationOptionsBase = {style: {opacity: 0}, duration: 500}
        void asyncAnimation(activeElements, activeElementsStyle)
        void asyncAnimation(inactiveElements, inactiveElementsStyle).then(
            () => hideElements(inactiveElements))
    }
}

function roundToNearest10(num: number): number {
    return Math.round(num / 10) * 10;
}

async function asyncAnimation(elements: Collection, options: AnimationOptions) {
    await new Promise<void>((resolve) => {
        options['complete'] = () => resolve()
        options['queue'] = false
        elements.animate(options);
    });
}

async function hideElements(elements: Collection) {
    let style = {display: 'none'}
    elements.style(style)
}

async function showElements(elements: Collection) {
    let style = {display: 'element'}
    elements.style(style)
}