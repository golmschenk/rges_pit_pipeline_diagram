import type {Brand} from "./brand.ts";
import type {EdgeDefinition, NodeDefinition} from "cytoscape";

export type GroupNode = Brand<NodeDefinition, 'GroupNode'>
export type DataNode = Brand<NodeDefinition, 'DataNode'>
export type DataFlowEdge = Brand<EdgeDefinition, 'DataFlowEdge'>

export const NodeTypeStyleClass = {
    WorkingGroup: 'working-group-node',
    ExternalGroup: 'external-group-node',
    DataProduct: 'data-product-node',
    Data: 'data-node'
} as const;
export type NodeTypeStyleClass = typeof NodeTypeStyleClass[keyof typeof NodeTypeStyleClass];

export const GroupType = {
    WorkingGroup: 'WorkingGroup',
    ExternalGroup: 'ExternalGroup',
    DataProduct: 'DataProduct',
} as const;
export type GroupType = typeof GroupType[keyof typeof GroupType];

export type GroupNodes = {
    workingGroup1Node: GroupNode,
    workingGroup2Node: GroupNode,
    workingGroup3Node: GroupNode,
    workingGroup4Node: GroupNode,
    workingGroup5Node: GroupNode,
    workingGroup6Node: GroupNode,
    workingGroup7Node: GroupNode,
    workingGroup8Node: GroupNode,
    workingGroup9Node: GroupNode,
    workingGroup10Node: GroupNode,
    workingGroup11Node: GroupNode,
    workingGroup12Node: GroupNode,
    workingGroup13Node: GroupNode,
    workingGroup14Node: GroupNode,
    dataProductGroupNode: GroupNode,
    msosPhotometryGroupNode: GroupNode,
    msosModelingGroupNode: GroupNode,
}


export type DataData = {
    name: string,
}

export type DataFlowData = {
    data: DataData,
    sourceGroup: GroupNode,
    destinationGroups: GroupNode[],
}