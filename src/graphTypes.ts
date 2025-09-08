import type {Brand} from "./brand.ts";
import type {EdgeDefinition, NodeDefinition} from "cytoscape";

export type GroupNodeDefinition = Brand<NodeDefinition, ['GroupNode']>
export type DataFlowNodeDefinition = Brand<NodeDefinition, ['DataFlowNode']>
export type DataTreeNodeDefinition = Brand<NodeDefinition, ['DataTreeNode']>
export type DataTreeAndDataFlowNodeDefinition = Brand<NodeDefinition, ['DataTreeNode', 'DataFlowNode']>
export type DataFlowEdgeDefinition = Brand<EdgeDefinition, ['DataFlowEdge']>
export type DataTreeEdgeDefinition = Brand<EdgeDefinition, ['DataTreeEdge']>

export const NodeTypeStyleClass = {
    WorkingGroup: 'working-group-node',
    ExternalGroup: 'external-group-node',
    DataProduct: 'data-product-node',
    DataFlow: 'data-flow-node',
    DataTree: 'data-tree-node',
    DataLeaf: 'data-leaf-node',
} as const;
export type NodeTypeStyleClass = typeof NodeTypeStyleClass[keyof typeof NodeTypeStyleClass];

export const EdgeTypeStyleClass = {
    DataFlow: 'data-flow-edge',
    DataTree: 'data-tree-edge',
} as const;
export type EdgeTypeStyleClass = typeof EdgeTypeStyleClass[keyof typeof EdgeTypeStyleClass];

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
    socGroup: GroupNodeDefinition,
}

export type DataLeafData = {
    name: string
    unit?: string
    frequency?: string
    latency?: string
    structure?: string
    format?: string
    exampleFileUrl?: string
    notes?: string
}

export type DataTreeData = {
    name: string
    unit?: string
    frequency?: string
    latency?: string
    dataElements: (DataTreeData | DataLeafData)[]
    notes?: string
}

export type DataFlowData = {
    data: DataTreeData | DataLeafData
    sourceGroup: GroupNodeDefinition
    destinationGroups: GroupNodeDefinition[]
}
