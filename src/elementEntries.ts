import {createDataFlowDefinitionAndAppendToElementDefinitions, createPipelineNodeDefinition} from "./graphFactories.ts";
import type {ElementDefinition} from "cytoscape";
import {pipelines} from "./element_entries/pipelines.ts";
import type {DataFlow} from "./element_data_types/data_flow.ts";
import type {Pipeline} from "./element_data_types/pipeline.ts";
import type {PipelineNodeDefinition} from "./graphTypes.ts";


export const pipelineNodeDefinitionsMap = new Map<Pipeline, PipelineNodeDefinition>(
    Object.values(pipelines).map(pipeline => [pipeline, createPipelineNodeDefinition(pipeline)])
);

let elementDefinitions: ElementDefinition[] = [...pipelineNodeDefinitionsMap.values()]

const dataFlowModules = import.meta.glob<{default: DataFlow}>(
    './element_entries/data_flows/**/*.ts',
    {eager: true}
);

export const dataFlows: DataFlow[] = Object.values(dataFlowModules).map(m => m.default);

dataFlows.forEach(dataFlow => {
    createDataFlowDefinitionAndAppendToElementDefinitions(dataFlow, elementDefinitions);
});
export {elementDefinitions};
