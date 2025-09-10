import type {AnimationOptions, Collection, Core, EdgeCollection, EventObject, NodeSingular, Position} from 'cytoscape';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import Handlebars from 'handlebars';
import dataTreeInformationTemplate from './data_tree_information.hbs?raw'
import dataLeafInformationTemplate from './data_leaf_information.hbs?raw'
import groupInformationTemplate from './group_information.hbs?raw'

import {elementDefinitions} from './elementEntries';
import {EdgeTypeStyleClass, NodeTypeStyleClass} from './graphTypes';
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


function offsetPositions(positions: Record<string, Position>, offset: Position): Record<string, Position> {
    let updatedPositions: Record<string, Position> = {}
    Object.entries(positions).forEach(([key, position]) => {
        updatedPositions[key] = {
            x: position.x + offset.x,
            y: position.y + offset.y
        }
    })
    return updatedPositions
}

function getNodePositions(nodes: cytoscape.NodeCollection) {
    return Object.fromEntries(
        nodes.map(node => [node.id(), {x: node.position().x, y: node.position().y}])
    );
}

export class App {
    cy: Core
    view: ViewType
    selectedNode: NodeSingular | null
    backButton: HTMLButtonElement
    savePositionsButton: HTMLButtonElement
    nodeInformationDiv: HTMLDivElement

    constructor(cy: Core) {
        this.cy = cy
        this.view = ViewType.GlobalView
        this.selectedNode = null
        this.backButton = document.getElementById('back_button')! as HTMLButtonElement
        this.savePositionsButton = document.getElementById('save_positions_button')! as HTMLButtonElement
        this.nodeInformationDiv = document.getElementById('node_information')! as HTMLDivElement
        this.cy.nodes().forEach(node => updateNodeDimensions(node));
        cy.on('tap', 'node', (event) => this.onclickDispatcher(event))
        this.backButton.addEventListener('click', () => this.backButtonCallback())
        this.savePositionsButton.addEventListener('click', () => this.saveNodePositions())
        this.animateEdges()
        cy.ready(() => this.setGlobalViewInstant())
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
                    selector: `.${NodeTypeStyleClass.DataLeaf}, .${NodeTypeStyleClass.DataTree}`,
                    style: {
                        shape: 'round-rectangle',
                        'corner-radius': '20px',
                        'background-color': '#FFFFC5',
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
                        'line-cap': 'square',
                        'curve-style': 'bezier',
                    }
                },
                {
                    selector: `.${EdgeTypeStyleClass.DataFlow}`,
                    style: {
                        'target-arrow-color': '#000000',
                        'target-arrow-shape': 'triangle',
                        'arrow-scale': 1.2,
                        'line-style': 'dashed',
                        'line-dash-pattern': [10, 10],
                    }
                },
                {
                    selector: `.${EdgeTypeStyleClass.DataFlow}`,
                    style: {}
                },
                {
                    selector: `.selected-node`,
                    style: {
                        'border-width': '2px',
                    }
                },
            ],
        });

        return new App(cy)
    }

    clearNodeSelection() {
        this.nodeInformationDiv.innerHTML = '<div>(Click a node for more information.)</div>'
        if (this.selectedNode !== null) {
            this.selectedNode.removeClass('selected-node')
        }
        this.selectedNode = null
    }

    setNodeSelection(node: NodeSingular) {
        this.clearNodeSelection()
        this.selectedNode = node
        this.selectedNode.addClass('selected-node')
        if (node.is(`.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}, 
                .${NodeTypeStyleClass.DataProduct}`)) {
            this.setInformationForGroupNode(node)
        } else if (node.hasClass(NodeTypeStyleClass.DataTree)) {
            this.setInformationForDataTreeNode(node)
        } else if (node.hasClass(NodeTypeStyleClass.DataLeaf)) {
            this.setInformationForDataLeafNode(node)
        }
    }

    private setInformationForGroupNode(node: NodeSingular) {
        const informationTemplate = Handlebars.compile(groupInformationTemplate);
        this.nodeInformationDiv.innerHTML = informationTemplate(node.data()['information'])
    }

    private setInformationForDataTreeNode(node: NodeSingular) {
        const informationTemplate = Handlebars.compile(dataTreeInformationTemplate);
        this.inheritInformationFromPredecessorsIfEmpty(node, 'unit')
        this.inheritInformationFromPredecessorsIfEmpty(node, 'frequency')
        this.inheritInformationFromPredecessorsIfEmpty(node, 'latency')
        this.nodeInformationDiv.innerHTML = informationTemplate(node.data()['information'])
    }

    private setInformationForDataLeafNode(node: NodeSingular) {
        const informationTemplate = Handlebars.compile(dataLeafInformationTemplate);
        this.inheritInformationFromPredecessorsIfEmpty(node, 'unit')
        this.inheritInformationFromPredecessorsIfEmpty(node, 'frequency')
        this.inheritInformationFromPredecessorsIfEmpty(node, 'latency')
        this.nodeInformationDiv.innerHTML = informationTemplate(node.data()['information'])
    }

    // TODO: Could do once on graph creation (need to alter how it's handled though).
    private inheritInformationFromPredecessorsIfEmpty(dataElement: NodeSingular, property: string) {
        let currentNode = dataElement
        while (dataElement.data().information[property] === undefined && currentNode.incomers().nodes()[0].hasClass(NodeTypeStyleClass.DataTree)) {
            const treeParent = currentNode.incomers().nodes()[0]
            if (treeParent.data().information[property] !== undefined) {
                dataElement.data().information[property] = treeParent.data().information[property] + ' <i>(inherited from parent)</i>'
                break
            }
            currentNode = treeParent
        }
    }

    setGroupFocusView(groupNode: NodeSingular) {
        const inputs = groupNode.incomers(`.${NodeTypeStyleClass.DataFlow}`)
        const sources = inputs.incomers(
            `.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}, 
            .${NodeTypeStyleClass.DataProduct}`)
        const outputs = groupNode.outgoers(`.${NodeTypeStyleClass.DataFlow}`)
        const destinations = outputs.outgoers(
            `.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}, 
            .${NodeTypeStyleClass.DataProduct}`)
        const activeNodes = groupNode.union(inputs).union(sources).union(outputs).union(destinations)
        const activeEdges = sources.edgesTo(inputs).union(inputs.edgesTo(groupNode))
            .union(groupNode.edgesTo(outputs)).union(outputs.edgesTo(destinations))
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

    setDataFlowView(dataFlowNode: NodeSingular) {
        // TODO: Using a cloned headless instance is probably safer than saving the old positions and then reloading them.
        const source = dataFlowNode.incomers(
            `.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}`)
        const destinations = dataFlowNode.outgoers(
            `.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}, 
            .${NodeTypeStyleClass.DataProduct}`)
        const childDataElementNodes = dataFlowNode.outgoers(
            `.${NodeTypeStyleClass.DataTree}, .${NodeTypeStyleClass.DataLeaf}`)
        // Need to have a separate successor call to make sure you don't get tree nodes from other data flows.
        let dataElementNodes = childDataElementNodes
        childDataElementNodes.forEach(childDataElementNode => {
            dataElementNodes = dataElementNodes.union(childDataElementNode.successors(`.${NodeTypeStyleClass.DataTree}, .${NodeTypeStyleClass.DataLeaf}`))
        })
        const dataFlowNodes = dataFlowNode.union(source).union(destinations);
        const dataTreeNodes = dataFlowNode.union(dataElementNodes)
        const dataFlowEdges = source.edgesTo(dataFlowNode).union(dataFlowNode.edgesTo(destinations));
        const dataTreeEdges = dataFlowNode.edgesWith(dataElementNodes).union(dataElementNodes.edgesWith(dataElementNodes));
        const dataFlowElements = dataFlowNodes.union(dataFlowEdges)
        const dataTreeElements = dataTreeNodes.union(dataTreeEdges)
        const activeElements = dataFlowElements.union(dataTreeElements)
        const activeNodes = activeElements.nodes()
        const oldPositions = getNodePositions(activeNodes);
        void this.animateChangeInActiveElements(activeElements)

        const dataFlowLayoutOptions = {
            name: 'dagre',
            // @ts-ignore
            rankDir: 'LR',
            animate: false,
            fit: false,
        }
        dataFlowElements.layout(dataFlowLayoutOptions).run();
        let dataFlowLayoutPositions = getNodePositions(dataFlowNodes)
        const dataTreeLayoutOptions = {
            name: 'dagre',
            // @ts-ignore
            rankDir: 'TB',
            fit: false,
            animate: false,
        }
        dataTreeElements.layout(dataTreeLayoutOptions).run();
        let dataTreeLayoutPositions = getNodePositions(dataTreeNodes)
        const dataTreeLayoutDataFLowNodePosition = dataTreeLayoutPositions[dataFlowNode.id()]
        const dataFlowLayoutDataFLowNodePosition = dataFlowLayoutPositions[dataFlowNode.id()]
        const dataFlowOffset = {
            x: dataTreeLayoutDataFLowNodePosition.x - dataFlowLayoutDataFLowNodePosition.x,
            y: dataTreeLayoutDataFLowNodePosition.y - dataFlowLayoutDataFLowNodePosition.y,
        }
        dataFlowLayoutPositions = offsetPositions(dataFlowLayoutPositions, dataFlowOffset)
        if (childDataElementNodes.length > 0) {
            let lowestDestination = destinations[0];
            destinations.forEach(destination => {
                if (destination.position().y > lowestDestination.position().y) {
                    lowestDestination = destination;
                }
            })
            const destinationsYOffset = dataFlowLayoutDataFLowNodePosition.y - lowestDestination.position().y
            destinations.forEach(destination => {
                dataFlowLayoutPositions[destination.id()] = {
                    x: dataFlowLayoutPositions[destination.id()].x,
                    y: dataFlowLayoutPositions[destination.id()].y + destinationsYOffset,
                }
            })
        }
        const oldLayoutOptions = {
            name: 'preset',
            fit: false,
            animate: false,
            positions: oldPositions,
        }
        activeNodes.layout(oldLayoutOptions).run()
        const newLayoutOptions = {
            name: 'preset',
            fit: true,
            padding: 10.0,
            animate: true,
            positions: {...dataTreeLayoutPositions, ...dataFlowLayoutPositions},
        }
        const information_template = Handlebars.compile(dataTreeInformationTemplate);
        this.nodeInformationDiv.innerHTML = information_template(dataFlowNode.data()['information_data'])
        activeElements.layout(newLayoutOptions).run()
    }

    dataTreeNodeClickCallback(dataTreeNode: NodeSingular) {
        const information_template = Handlebars.compile(dataTreeInformationTemplate);
        this.nodeInformationDiv.innerHTML = information_template(dataTreeNode.data()['information_data'])
    }

    onclickDispatcher(event: EventObject) {
        let targetElement = event.target
        if (targetElement.isNode()) {
            this.backButton.disabled = false
            if (targetElement.is(
                `.${NodeTypeStyleClass.WorkingGroup}, .${NodeTypeStyleClass.ExternalGroup}, 
                .${NodeTypeStyleClass.DataProduct}`)) {
                this.setGroupFocusView(event.target)
                this.setNodeSelection(event.target)
            }
            if (targetElement.hasClass(NodeTypeStyleClass.DataFlow)) {
                this.setDataFlowView(event.target)
            }
            if (targetElement.hasClass(NodeTypeStyleClass.DataTree)) {
                this.dataTreeNodeClickCallback(event.target)
                this.setNodeSelection(event.target)
            }
            if (targetElement.hasClass(NodeTypeStyleClass.DataLeaf)) {
                this.dataTreeNodeClickCallback(event.target)
                this.setNodeSelection(event.target)
            }
        }
    }

    backButtonCallback() {
        this.setGlobalView()
    }

    setGlobalView() {
        this.backButton.disabled = true
        const activeNodes = this.cy.nodes().filter(`.${NodeTypeStyleClass.WorkingGroup}, ` +
            `.${NodeTypeStyleClass.ExternalGroup}, .${NodeTypeStyleClass.DataFlow}`)
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
        this.clearNodeSelection()
        activeElements.layout(layoutOptions).run()
    }

    setGlobalViewInstant() {
        this.backButton.disabled = true
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
        this.clearNodeSelection()
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
        void marchingAntsAnimationForEdges(this.cy.edges().filter(`.${EdgeTypeStyleClass.DataFlow}`))
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