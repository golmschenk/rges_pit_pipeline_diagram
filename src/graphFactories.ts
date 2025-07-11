import {
    type DataFlowData,
    type DataFlowEdgeDefinition,
    type DataNodeDefinition,
    type GroupNodeDefinition,
    GroupType,
    NodeTypeStyleClass
} from "./graphTypes.ts";
import {v4 as uuid4, v5 as uuid5} from "uuid";
import type {ElementDefinition, NodeDefinition} from "cytoscape";

const PROJECT_NAMESPACE_UUID = '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b';

export function createGroupNodeDefinition(name: string, groupType: GroupType = GroupType.WorkingGroup): GroupNodeDefinition {
    let classes: string[] = [NodeTypeStyleClass[groupType]]
    return {
        group: 'nodes',
        data: {
            id: uuid5(name, PROJECT_NAMESPACE_UUID),
            name: name,
        },
        classes: classes,
        __brand: 'GroupNode',
    };
}

function createDataNodeDefinition(name: string, sourceName: string): DataNodeDefinition {
    return {
        group: 'nodes',
        data: {
            id: uuid5(name + sourceName, PROJECT_NAMESPACE_UUID),
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
            id: uuid4(),
            source: sourceNode.data.id!,
            target: destinationNode.data.id!,
        },
        __brand: 'DataFlowEdge',
    };
}

function createDataFlowDefinition(dataFlowData: DataFlowData): [DataNodeDefinition, DataFlowEdgeDefinition[]] {
    const dataNode = createDataNodeDefinition(dataFlowData.data.name, dataFlowData.sourceGroup.data.name)
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
