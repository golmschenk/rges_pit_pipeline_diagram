import {
    type DataFlowData,
    type DataFlowEdgeDefinition,
    type DataFlowNodeDefinition,
    type GroupNodeDefinition,
    GroupType,
    NodeTypeStyleClass
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
        __brand: 'GroupNode',
    };
}

function createDataNodeDefinition(name: string, sourceName: string): DataFlowNodeDefinition {
    return {
        group: 'nodes',
        data: {
            id: uuid5(name + sourceName, PROJECT_NAMESPACE_UUID),
            name: name,
            height: defaultNodeHeight,
            width: defaultNodeWidth,
        },
        classes: [NodeTypeStyleClass.DataFlow],
        __brand: 'DataFlowNode',
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
        __brand: 'DataFlowEdge',
    };
}

function createDataTree(dataFlowData: DataFlowData) {
    return createDataNodeDefinition(dataFlowData.data.description, dataFlowData.sourceGroup.data.name);
}

function createDataFlowDefinition(dataFlowData: DataFlowData): [DataFlowNodeDefinition, DataFlowEdgeDefinition[]] {
    const dataFlowNode = createDataTree(dataFlowData)
    const dataFlowEdges: DataFlowEdgeDefinition[] = []
    const dataFlowEdge = createDataFlowEdgeDefinition(dataFlowData.sourceGroup, dataFlowNode)
    dataFlowEdges.push(dataFlowEdge)
    dataFlowData.destinationGroups.forEach((destinationGroupNode) => {
        const dataFlowEdge = createDataFlowEdgeDefinition(dataFlowNode, destinationGroupNode)
        dataFlowEdges.push(dataFlowEdge)
    })
    return [dataFlowNode, dataFlowEdges]
}

export function createDataFlowDefinitionAndAppendToElementDefinitions(dataFlowData: DataFlowData, elementDefinitions: ElementDefinition[]): void {
    const [dataNode, dataFlowEdges] = createDataFlowDefinition(dataFlowData)
    elementDefinitions.push(dataNode, ...dataFlowEdges);
}
