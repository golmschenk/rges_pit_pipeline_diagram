import {createDataFlowDefinitionAndAppendToElementDefinitions} from "./graphFactories.ts";
import type {ElementDefinition} from "cytoscape";
import {pipelineNodeDefinitions} from "./element_entries/pipeline_definitions.ts";
import type {DataFlow} from "./element_data_types/data_flow.ts";


let elementDefinitions: ElementDefinition[] = Object.values(pipelineNodeDefinitions);

const dataFlowModules = import.meta.glob<{default: DataFlow}>(
    './element_entries/data_flows/**/*.ts',
    {eager: true}
);

export const dataFlows: DataFlow[] = Object.values(dataFlowModules).map(m => m.default);

dataFlows.forEach(dataFlow => {
    createDataFlowDefinitionAndAppendToElementDefinitions(dataFlow, elementDefinitions);
});
export {elementDefinitions};
