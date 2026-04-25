import {createPipelineNodeDefinition} from "../graphFactories.ts";
import {type PipelineNodeDefinition, PipelineNodeType} from "../graphTypes.ts";
import {WorkingGroups} from "./working_groups.ts";

export const pipelineNodeDefinitions = {
    workingGroup3Pipeline: createPipelineNodeDefinition('Event modeling pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup3),
    lensFluxAnalysisPipeline: createPipelineNodeDefinition('Lens flux analysis pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup4),
    differenceImageAnalysisPipeline: createPipelineNodeDefinition('Difference image analysis pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup4),
    workingGroup5Pipeline: createPipelineNodeDefinition('Event and anomaly detection pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup5),
    workingGroup6Pipeline: createPipelineNodeDefinition('Variable stars pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup6),
    workingGroup7Pipeline: createPipelineNodeDefinition('Survey simulations and pipeline validation pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup7),
    workingGroup8Pipeline: createPipelineNodeDefinition('Contemporaneous and precursor observations pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup8),
    workingGroup9Pipeline: createPipelineNodeDefinition('Data challenges, outreach, and citizen science pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup9),
    workingGroup10Pipeline: createPipelineNodeDefinition('Microlensing mini-courses pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup10),
    workingGroup11Pipeline: createPipelineNodeDefinition('Free floating planets pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup11),
    workingGroup12Pipeline: createPipelineNodeDefinition('Efficiency and occurrence rate analysis pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup12),
    workingGroup13Pipeline: createPipelineNodeDefinition('Astrometry analysis pipeline', PipelineNodeType.WorkingGroupPipeline, WorkingGroups.workingGroup13),
    Public: createPipelineNodeDefinition('Public', PipelineNodeType.Public),
    msosPhotometryPipeline: createPipelineNodeDefinition('MSOS photometry', PipelineNodeType.ExternalGroupPipeline),
    msosModelingPipeline: createPipelineNodeDefinition('MSOS modeling', PipelineNodeType.ExternalGroupPipeline),
    socPipeline: createPipelineNodeDefinition('SOC', PipelineNodeType.ExternalGroupPipeline),
} satisfies Record<string, PipelineNodeDefinition>;