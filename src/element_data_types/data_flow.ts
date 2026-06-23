import type {DataTree} from "./data_tree.ts";
import type {DataLeaf} from "./data_leaf.ts";
import type {Pipeline} from "./pipeline.ts";

export type DataFlow = {
    data: DataTree | DataLeaf
    sourcePipeline: Pipeline
    destinationPipelines: Pipeline[]
}
