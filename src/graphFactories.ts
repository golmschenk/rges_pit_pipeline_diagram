import {
    type DataFlowData,
    type DataFlowEdgeDefinition,
    type DataNodeDefinition,
    type GroupNodeDefinition,
    GroupType,
    NodeTypeStyleClass
} from "./graphTypes.ts";
import {v4 as uuid} from "uuid";
import type {ElementDefinition, NodeDefinition} from "cytoscape";

export function createGroupNodeDefinition(name: string, groupType: GroupType = GroupType.WorkingGroup): GroupNodeDefinition {
    let classes: string[] = [NodeTypeStyleClass[groupType]]
    return {
        group: 'nodes',
        data: {
            id: uuid(),
            name: name,
        },
        classes: classes,
        __brand: 'GroupNode',
    };
}

function createDataNodeDefinition(name: string): DataNodeDefinition {
    return {
        group: 'nodes',
        data: {
            id: uuid(),
            name: name,
        },
        classes: [NodeTypeStyleClass.Data],
        __brand: 'DataNode',
    };
}

function createDataFlowEdgeDefinition(sourceNode: NodeDefinition, destinationNode: NodeDefinition): DataFlowEdgeDefinition {
    return {
        group: 'edges',
        data: {
            id: uuid(),
            source: sourceNode.data.id!,
            target: destinationNode.data.id!,
        },
        __brand: 'DataFlowEdge',
    };
}

function createDataFlowDefinition(dataFlowData: DataFlowData): [DataNodeDefinition, DataFlowEdgeDefinition[]] {
    const dataNode = createDataNodeDefinition(dataFlowData.data.name)
    const dataFlowEdges: DataFlowEdgeDefinition[] = []
    const dataFlowEdge = createDataFlowEdgeDefinition(dataFlowData.sourceGroup, dataNode)
    dataFlowEdges.push(dataFlowEdge)
    dataFlowData.destinationGroups.forEach((destinationGroupNode) => {
        const dataFlowEdge = createDataFlowEdgeDefinition(dataNode, destinationGroupNode)
        dataFlowEdges.push(dataFlowEdge)
    })
    return [dataNode, dataFlowEdges]
}

export function createDataFlowDefinitionAndAppendToElementDefinitions(dataFlowData: DataFlowData, elementDefinitions: ElementDefinition[]): void {
    const [dataNode, dataFlowEdges] = createDataFlowDefinition(dataFlowData)
    elementDefinitions.push(dataNode, ...dataFlowEdges);
}
