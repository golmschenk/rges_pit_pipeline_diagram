import {
    type DataFlowData,
    type DataFlowEdge,
    type DataNode,
    type GroupNode,
    GroupType,
    NodeTypeStyleClass
} from "./graphTypes.ts";
import {v4 as uuid} from "uuid";
import type {ElementDefinition, NodeDefinition} from "cytoscape";

export function createGroupNode(name: string, groupType: GroupType = GroupType.WorkingGroup): GroupNode {
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

function createDataNode(name: string): DataNode {
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

function createDataFlowEdge(sourceNode: NodeDefinition, destinationNode: NodeDefinition): DataFlowEdge {
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

function createDataFlow(dataFlowData: DataFlowData): [DataNode, DataFlowEdge[]] {
    const dataNode = createDataNode(dataFlowData.data.name)
    const dataFlowEdges: DataFlowEdge[] = []
    const dataFlowEdge = createDataFlowEdge(dataFlowData.sourceGroup, dataNode)
    dataFlowEdges.push(dataFlowEdge)
    dataFlowData.destinationGroups.forEach((destinationGroupNode) => {
        const dataFlowEdge = createDataFlowEdge(dataNode, destinationGroupNode)
        dataFlowEdges.push(dataFlowEdge)
    })
    return [dataNode, dataFlowEdges]
}

export function createDataFlowAndAppendToElements(dataFlowData: DataFlowData, elements: ElementDefinition[]): void {
    const [dataNode, dataFlowEdges] = createDataFlow(dataFlowData)
    elements.push(dataNode, ...dataFlowEdges);
}
