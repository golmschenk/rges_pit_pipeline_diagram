import {
    type DataFlowData,
    type DataTreeData,
    type DataFlowEdgeDefinition,
    type DataFlowNodeDefinition,
    type DataTreeNodeDefinition,
    type DataTreeAndDataFlowNodeDefinition,
    type GroupNodeDefinition,
    GroupType,
    NodeTypeStyleClass,
    type DataLeafData, type DataTreeEdgeDefinition
} from "./graphTypes.ts";
import {v4 as uuid4, v5 as uuid5} from "uuid";
import type {ElementDefinition, NodeDefinition} from "cytoscape";

const PROJECT_NAMESPACE_UUID = '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b';

const defaultNodeHeight = 90;
const defaultNodeWidth = 180;

export function createGroupNodeDefinition(name: string, groupType: GroupType = GroupType.WorkingGroup): GroupNodeDefinition {
    let classes: string[] = [NodeTypeStyleClass[groupType]]
    return {
        group: 'nodes',
        data: {
            id: uuid5(name, PROJECT_NAMESPACE_UUID),
            name: name,
            height: defaultNodeHeight,
            width: defaultNodeWidth,
        },
        classes: classes,
        __brand_GroupNode: true,
    };
}

function createDataFlowNodeDefinition(name: string, sourceName: string): DataFlowNodeDefinition {
    return {
        group: 'nodes',
        data: {
            id: uuid5(name + sourceName, PROJECT_NAMESPACE_UUID),
            name: name,
            height: defaultNodeHeight,
            width: defaultNodeWidth,
        },
        classes: [NodeTypeStyleClass.DataFlow, NodeTypeStyleClass.DataTree],
        __brand_DataFlowNode: true,
    };
}

function createDataTreeNodeDefinition(name: string, idOverride?: string): DataTreeNodeDefinition {
    const id = idOverride ? idOverride : uuid4()
    return {
        group: 'nodes',
        data: {
            id: id,
            name: name,
            height: defaultNodeHeight,
            width: defaultNodeWidth,
        },
        classes: [NodeTypeStyleClass.DataTree],
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
        __brand_DataTreeEdge: true,
    };
}

function isDataTreeData(data: DataTreeData | DataLeafData): data is DataTreeData {
    return 'dataElements' in data;
}

function createDataTree(dataElement: DataTreeData | DataLeafData, dataElementIdOverride?: string): [DataTreeNodeDefinition, ElementDefinition[]] {
    const rootNodeDefinition = createDataTreeNodeDefinition(dataElement.name, dataElementIdOverride);
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

function createDataTreeForDataFlowData(dataFlowData: DataFlowData): [DataTreeAndDataFlowNodeDefinition, ElementDefinition[]] {
    const [rootNodeDefinition, treeElementDefinitions] = createDataTree(dataFlowData.data, uuid5(dataFlowData.data.name + dataFlowData.sourceGroup.data.name, PROJECT_NAMESPACE_UUID))
    const rootNodeDefinitionWithDataFlowNodeType = {
        ...rootNodeDefinition,
        classes: [NodeTypeStyleClass.DataFlow, NodeTypeStyleClass.DataTree],
        __brand_DataFlowNode: true,
    } as DataTreeAndDataFlowNodeDefinition
    return [rootNodeDefinitionWithDataFlowNodeType, treeElementDefinitions]
}

function createDataFlowDefinition(dataFlowData: DataFlowData): ElementDefinition[] {
    let elementDefinitions: ElementDefinition[] = []
    const [dataFlowNodeDefinition, dataTreeElementDefinitions] = createDataTreeForDataFlowData(dataFlowData)
    elementDefinitions.push(dataFlowNodeDefinition, ...dataTreeElementDefinitions)
    const dataFlowEdge = createDataFlowEdgeDefinition(dataFlowData.sourceGroup, dataFlowNodeDefinition)
    elementDefinitions.push(dataFlowEdge)
    dataFlowData.destinationGroups.forEach((destinationGroupNodeDefinition) => {
        const dataFlowEdge = createDataFlowEdgeDefinition(dataFlowNodeDefinition, destinationGroupNodeDefinition)
        elementDefinitions.push(dataFlowEdge)
    })
    return elementDefinitions
}

export function createDataFlowDefinitionAndAppendToElementDefinitions(dataFlowData: DataFlowData, elementDefinitions: ElementDefinition[]): void {
    const newElementDefinitions = createDataFlowDefinition(dataFlowData)
    elementDefinitions.push(...newElementDefinitions);
}
