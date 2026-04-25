import type {DataFlowData} from "./graphTypes.ts";
import {createDataFlowDefinitionAndAppendToElementDefinitions} from "./graphFactories.ts";
import type {ElementDefinition} from "cytoscape";
import {pipelineNodeDefinitions} from "./element_entries/pipeline_definitions.ts";


let elementDefinitions: ElementDefinition[] = Object.values(pipelineNodeDefinitions);

const dataFlowModules = import.meta.glob<{default: DataFlowData}>(
    './element_entries/data_flows/**/*.ts',
    {eager: true}
);

export const dataFlows: DataFlowData[] = Object.values(dataFlowModules).map(m => m.default);

dataFlows.forEach(dataFlow => {
    createDataFlowDefinitionAndAppendToElementDefinitions(dataFlow, elementDefinitions);
});
export {elementDefinitions};
