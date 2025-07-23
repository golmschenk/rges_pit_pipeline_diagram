import type {Brand} from "./brand.ts";
import type {EdgeDefinition, NodeDefinition} from "cytoscape";

export type GroupNodeDefinition = Brand<NodeDefinition, 'GroupNode'>
export type DataNodeDefinition = Brand<NodeDefinition, 'DataNode'>
export type DataFlowEdgeDefinition = Brand<EdgeDefinition, 'DataFlowEdge'>

export const NodeTypeStyleClass = {
    WorkingGroup: 'working-group-node',
    ExternalGroup: 'external-group-node',
    DataProduct: 'data-product-node',
    DataFlow: 'data-flow-node'
} as const;
export type NodeTypeStyleClass = typeof NodeTypeStyleClass[keyof typeof NodeTypeStyleClass];

export const GroupType = {
    WorkingGroup: 'WorkingGroup',
    ExternalGroup: 'ExternalGroup',
    DataProduct: 'DataProduct',
} as const;
export type GroupType = typeof GroupType[keyof typeof GroupType];

export type GroupNodesDefinitions = {
    workingGroup1: GroupNodeDefinition,
    workingGroup2: GroupNodeDefinition,
    workingGroup3: GroupNodeDefinition,
    workingGroup4: GroupNodeDefinition,
    workingGroup5: GroupNodeDefinition,
    workingGroup6: GroupNodeDefinition,
    workingGroup7: GroupNodeDefinition,
    workingGroup8: GroupNodeDefinition,
    workingGroup9: GroupNodeDefinition,
    workingGroup10: GroupNodeDefinition,
    workingGroup11: GroupNodeDefinition,
    workingGroup12: GroupNodeDefinition,
    workingGroup13: GroupNodeDefinition,
    workingGroup14: GroupNodeDefinition,
    dataProductGroup: GroupNodeDefinition,
    msosPhotometryGroup: GroupNodeDefinition,
    msosModelingGroup: GroupNodeDefinition,
}

export type DataNodeData = {
    description: string
    unit?: string
    frequency?: string
    structure?: string
    format?: string
    exampleFileUrl?: string
}

export type DataTreeData = {
    description: string
    unit?: string
    frequency?: string
    dataElements: (DataTreeData | DataNodeData)[]
}

export type DataFlowData = {
    data: DataTreeData | DataNodeData
    sourceGroup: GroupNodeDefinition
    destinationGroups: GroupNodeDefinition[]
}