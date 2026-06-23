import {
    type DataFlowEdgeDefinition,
    type DataTreeNodeDefinition,
    type DataTreeAndDataFlowNodeDefinition,
    type PipelineNodeDefinition,
    PipelineNodeType,
    NodeTypeStyleClass,
    type DataTreeEdgeDefinition, EdgeTypeStyleClass
} from "./graphTypes.ts";
import {v4 as uuid4, v5 as uuid5} from "uuid";
import type {ElementDefinition, NodeDefinition} from "cytoscape";

import type {WorkingGroup} from "./element_data_types/working_group.ts";
import type {DataFlow} from "./element_data_types/data_flow.ts";
import type {DataTree} from "./element_data_types/data_tree.ts";
import type {DataLeaf} from "./element_data_types/data_leaf.ts";
import type {Pipeline} from "./element_data_types/pipeline.ts";
import {Exception} from "handlebars";
import {pipelines} from "./element_entries/pipelines.ts";
import {pipelineNodeDefinitionsMap} from "./elementEntries.ts";

const PROJECT_NAMESPACE_UUID = '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b';

const defaultNodeHeight = 90;
const defaultNodeWidth = 180;

export function createPipelineNodeDefinition(pipeline: Pipeline): PipelineNodeDefinition {
    let classes: string[]
    let node_label: string
    if (pipeline.owner.type == 'WorkingGroup'){
        classes = [NodeTypeStyleClass.WorkingGroupPipeline]
        node_label = pipeline.name + ` (WG${pipeline.owner.number})`
    }
    else if (pipeline.owner.type == 'ExternalGroup'){
        if (pipeline === pipelines.Public){
            classes = [NodeTypeStyleClass.Public]

        }
        else {
            classes = [NodeTypeStyleClass.ExternalGroupPipeline]
        }
        node_label = pipeline.name
    }
    else {
        throw new Exception('Pipeline owner type unknown.')

    }

    return {
        group: 'nodes',
        data: {
            id: uuid5(pipeline.name, PROJECT_NAMESPACE_UUID),
            name: node_label,
            height: defaultNodeHeight,
            width: defaultNodeWidth,
            information: {
                name: pipeline.name

            }
        },
        classes: classes,
        __brand_PipelineNode: true,
    };
}

function createDataTreeNodeDefinition(name: string, information: Record<string, any>, nodeTypeStyleClass: NodeTypeStyleClass, idOverride?: string): DataTreeNodeDefinition {
    const id = idOverride ? idOverride : uuid4()
    return {
        group: 'nodes',
        data: {
            id: id,
            name: name,
            height: defaultNodeHeight,
            width: defaultNodeWidth,
            information: information
        },
        classes: [nodeTypeStyleClass],
        __brand_DataTreeNode: true,
    };
}

function createDataFlowEdgeDefinition(sourceNode: NodeDefinition, destinationNode: NodeDefinition): DataFlowEdgeDefinition {
    return {
        group: 'edges',
        data: {
            id: uuid4(),
            source: sourceNode.data.id!,
            target: destinationNode.data.id!,
            height: defaultNodeHeight,
            width: defaultNodeWidth,
        },
        classes: [EdgeTypeStyleClass.DataFlow],
        __brand_DataFlowEdge: true,
    };
}

function createDataTreeEdgeDefinition(sourceNode: NodeDefinition, destinationNode: NodeDefinition): DataTreeEdgeDefinition {
    return {
        group: 'edges',
        data: {
            id: uuid4(),
            source: sourceNode.data.id!,
            target: destinationNode.data.id!,
            height: defaultNodeHeight,
            width: defaultNodeWidth,
        },
        classes: [EdgeTypeStyleClass.DataTree],
        __brand_DataTreeEdge: true,
    };
}

function isDataTreeData(data: DataTree | DataLeaf): data is DataTree {
    return 'dataElements' in data;
}

function createDataTree(dataElement: DataTree | DataLeaf, dataElementIdOverride?: string): [DataTreeNodeDefinition, ElementDefinition[]] {
    let information: Record<string, any>
    let dataElementNodeClass: NodeTypeStyleClass
    if (isDataTreeData(dataElement)) {
        const{dataElements: _, ...information_data_} = dataElement
        information = information_data_
        dataElementNodeClass = NodeTypeStyleClass.DataTree;
    } else {
        information = dataElement
        dataElementNodeClass = NodeTypeStyleClass.DataLeaf;
    }
    const rootNodeDefinition = createDataTreeNodeDefinition(dataElement.name, information, dataElementNodeClass, dataElementIdOverride);
    let treeElementDefinitions: ElementDefinition[] = []
    if (isDataTreeData(dataElement)) {
        dataElement.dataElements.forEach(subDataElement => {
            const [subRootNodeDefinition, subTreeElementDefinitions] = createDataTree(subDataElement)
            const edgeToSubTree = createDataTreeEdgeDefinition(rootNodeDefinition, subRootNodeDefinition)
            treeElementDefinitions.push(subRootNodeDefinition, edgeToSubTree, ...subTreeElementDefinitions)
        })
    }
    return [rootNodeDefinition, treeElementDefinitions];
}

function createDataTreeForDataFlowData(dataFlowData: DataFlow): [DataTreeAndDataFlowNodeDefinition, ElementDefinition[]] {
    const [rootNodeDefinition, treeElementDefinitions] = createDataTree(dataFlowData.data, uuid5(dataFlowData.data.name + dataFlowData.sourcePipeline.name, PROJECT_NAMESPACE_UUID))
    let dataElementNodeClass: NodeTypeStyleClass
    if (isDataTreeData(dataFlowData.data)) {
        dataElementNodeClass = NodeTypeStyleClass.DataTree;
    } else {
        dataElementNodeClass = NodeTypeStyleClass.DataLeaf;
    }
    const rootNodeDefinitionWithDataFlowNodeType = {
        ...rootNodeDefinition,
        classes: [NodeTypeStyleClass.DataFlow, dataElementNodeClass],
        __brand_DataFlowNode: true,
    } as DataTreeAndDataFlowNodeDefinition
    return [rootNodeDefinitionWithDataFlowNodeType, treeElementDefinitions]
}

function createDataFlowDefinition(dataFlowData: DataFlow): ElementDefinition[] {
    let elementDefinitions: ElementDefinition[] = []
    const [dataFlowNodeDefinition, dataTreeElementDefinitions] = createDataTreeForDataFlowData(dataFlowData)
    elementDefinitions.push(dataFlowNodeDefinition, ...dataTreeElementDefinitions)
    const dataFlowEdge = createDataFlowEdgeDefinition(pipelineNodeDefinitionsMap.get(dataFlowData.sourcePipeline), dataFlowNodeDefinition)
    elementDefinitions.push(dataFlowEdge)
    dataFlowData.destinationPipelines.forEach((destinationPipelineNodeDefinition) => {
        const dataFlowEdge = createDataFlowEdgeDefinition(dataFlowNodeDefinition, pipelineNodeDefinitionsMap.get(destinationPipelineNodeDefinition))
        elementDefinitions.push(dataFlowEdge)
    })
    return elementDefinitions
}

export function createDataFlowDefinitionAndAppendToElementDefinitions(dataFlowData: DataFlow, elementDefinitions: ElementDefinition[]): void {
    const newElementDefinitions = createDataFlowDefinition(dataFlowData)
    elementDefinitions.push(...newElementDefinitions);
}
