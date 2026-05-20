import type {PipelineNodeDefinition} from "../graphTypes.ts";
import type {DataTree} from "./data_tree.ts";
import type {DataLeaf} from "./data_leaf.ts";

export type DataFlow = {
    data: DataTree | DataLeaf
    sourcePipeline: PipelineNodeDefinition
    destinationPipelines: PipelineNodeDefinition[]
}