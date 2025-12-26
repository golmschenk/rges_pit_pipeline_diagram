import type {
    AnimationOptions,
    Collection,
    Core,
    EventObject,
    NodeSingular
} from 'cytoscape';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import Handlebars from 'handlebars';
import dataTreeInformationTemplate from './data_tree_information.hbs?raw'
import dataLeafInformationTemplate from './data_leaf_information.hbs?raw'
import pipelineInformationTemplate from './pipeline_information.hbs?raw'

import {elementDefinitions} from './elementEntries';
import {EdgeTypeStyleClass, NodeTypeStyleClass} from './graphTypes';
import defaultGlobalViewNodePositionsJson from './default_global_positions.json';
import {getDefaultAppStyle} from "./styling.ts";
import {marchingAntsAnimationForEdges} from "./prettification.ts";
import {getNodePositions, offsetPositions, updateNodeDimensions} from "./sizeAndPosition.ts";

export const ViewType = {
    GlobalView: 'GlobalView',
    PipelineFocusView: 'PipelineFocusView',
} as const;
export type ViewType = typeof ViewType[keyof typeof ViewType];

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
        // TODO: The below is a hack to fix a bug where the view is not centered in Safari occasionally. This should
        //       not be needed. Probably only `cy.ready(() => this.setGlobalViewInstant()) should be needed.
        this.setGlobalViewInstant()
        cy.ready(async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
            this.setGlobalViewInstant();
        })

        // If localhost, make the save positions button available.
        const isLocalhost = window.location.hostname.includes('localhost');
        if (isLocalhost) {
            const savePositionsButton = document.getElementById('save_positions_button');
            savePositionsButton?.classList.remove('hidden');
        }
    }

    static create(): App {
        cytoscape.use(dagre);
        let defaultStyle = getDefaultAppStyle();
        let cy = cytoscape({
            container: document.getElementById('cytoscape_container'),
            elements: elementDefinitions,
            style: defaultStyle,
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
        if (node.is(`.${NodeTypeStyleClass.WorkingGroupPipeline}, .${NodeTypeStyleClass.ExternalGroupPipeline}, 
                .${NodeTypeStyleClass.Public}`)) {
            this.setInformationForPipelineNode(node)
        } else if (node.hasClass(NodeTypeStyleClass.DataTree)) {
            this.setInformationForDataTreeNode(node)
        } else if (node.hasClass(NodeTypeStyleClass.DataLeaf)) {
            this.setInformationForDataLeafNode(node)
        }
    }

    private setInformationForPipelineNode(node: NodeSingular) {
        const informationTemplate = Handlebars.compile(pipelineInformationTemplate);
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

    setPipelineFocusView(pipelineNode: NodeSingular) {
        const inputs = pipelineNode.incomers(`.${NodeTypeStyleClass.DataFlow}`)
        const sources = inputs.incomers(
            `.${NodeTypeStyleClass.WorkingGroupPipeline}, .${NodeTypeStyleClass.ExternalGroupPipeline}, 
            .${NodeTypeStyleClass.Public}`)
        const outputs = pipelineNode.outgoers(`.${NodeTypeStyleClass.DataFlow}`)
        const destinations = outputs.outgoers(
            `.${NodeTypeStyleClass.WorkingGroupPipeline}, .${NodeTypeStyleClass.ExternalGroupPipeline}, 
            .${NodeTypeStyleClass.Public}`)
        const activeNodes = pipelineNode.union(inputs).union(sources).union(outputs).union(destinations)
        const activeEdges = sources.edgesTo(inputs).union(inputs.edgesTo(pipelineNode))
            .union(pipelineNode.edgesTo(outputs)).union(outputs.edgesTo(destinations))
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
            `.${NodeTypeStyleClass.WorkingGroupPipeline}, .${NodeTypeStyleClass.ExternalGroupPipeline}`)
        const destinations = dataFlowNode.outgoers(
            `.${NodeTypeStyleClass.WorkingGroupPipeline}, .${NodeTypeStyleClass.ExternalGroupPipeline}, 
            .${NodeTypeStyleClass.Public}`)
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
                `.${NodeTypeStyleClass.WorkingGroupPipeline}, .${NodeTypeStyleClass.ExternalGroupPipeline}, 
                .${NodeTypeStyleClass.Public}`)) {
                this.setPipelineFocusView(event.target)
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
        const activeNodes = this.cy.nodes().filter(`.${NodeTypeStyleClass.WorkingGroupPipeline}, ` +
            `.${NodeTypeStyleClass.ExternalGroupPipeline}, .${NodeTypeStyleClass.DataFlow}`)
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
        const activeNodes = this.cy.nodes().filter(`.${NodeTypeStyleClass.WorkingGroupPipeline}, ` +
            `.${NodeTypeStyleClass.ExternalGroupPipeline}, .${NodeTypeStyleClass.DataFlow}`)
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