import type {Brand} from "./brand.ts";
import type {EdgeDefinition, NodeDefinition} from "cytoscape";

export type PipelineNodeDefinition = Brand<NodeDefinition, ['PipelineNode']>
export type DataFlowNodeDefinition = Brand<NodeDefinition, ['DataFlowNode']>
export type DataTreeNodeDefinition = Brand<NodeDefinition, ['DataTreeNode']>
export type DataTreeAndDataFlowNodeDefinition = Brand<NodeDefinition, ['DataTreeNode', 'DataFlowNode']>
export type DataFlowEdgeDefinition = Brand<EdgeDefinition, ['DataFlowEdge']>
export type DataTreeEdgeDefinition = Brand<EdgeDefinition, ['DataTreeEdge']>

export const NodeTypeStyleClass = {
    WorkingGroupPipeline: 'working-group-pipeline-node',
    ExternalGroupPipeline: 'external-group-pipeline-node',
    Public: 'public-node',
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

export const PipelineNodeType = {
    WorkingGroupPipeline: 'WorkingGroupPipeline',
    ExternalGroupPipeline: 'ExternalGroupPipeline',
    Public: 'Public',
} as const;
export type PipelineNodeType = typeof PipelineNodeType[keyof typeof PipelineNodeType];

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
    host?: string
    unitDataSize?: string
    totalNumberOfUnits?: string
    totalDataSize?: string
}

export type DataFlowData = {
    data: DataTreeData | DataLeafData
    sourcePipeline: PipelineNodeDefinition
    destinationPipelines: PipelineNodeDefinition[]
}
