import {WorkingGroups} from "./working_groups.ts";
import type {Pipeline} from "../element_data_types/pipeline.ts";
import {ExternalGroups} from "./external_groups.ts";

export const pipelines = {
    workingGroup3Pipeline: {name: 'Event modeling pipeline', owner:  WorkingGroups.workingGroup3},
    lensFluxAnalysisPipeline: {name: 'Lens flux analysis pipeline', owner:  WorkingGroups.workingGroup4},
    differenceImagePipeline: {name: 'Difference image pipeline', owner:  WorkingGroups.workingGroup4},
    differenceImageAnalysisPipeline: {name: 'Difference image analysis pipeline', owner:  WorkingGroups.workingGroup4},
    workingGroup5Pipeline: {name: 'Event and anomaly detection pipeline', owner:  WorkingGroups.workingGroup5},
    workingGroup6Pipeline: {name: 'Variable stars pipeline', owner:  WorkingGroups.workingGroup6},
    workingGroup7Pipeline: {name: 'Survey simulations and pipeline validation pipeline', owner:  WorkingGroups.workingGroup7},
    workingGroup8Pipeline: {name: 'Contemporaneous and precursor observations pipeline', owner:  WorkingGroups.workingGroup8},
    workingGroup9Pipeline: {name: 'Data challenges, outreach, and citizen science pipeline', owner:  WorkingGroups.workingGroup9},
    workingGroup10Pipeline: {name: 'Microlensing mini-courses pipeline', owner:  WorkingGroups.workingGroup10},
    workingGroup11Pipeline: {name: 'Free floating planets pipeline', owner:  WorkingGroups.workingGroup11},
    workingGroup12Pipeline: {name: 'Efficiency and occurrence rate analysis pipeline', owner:  WorkingGroups.workingGroup12},
    workingGroup13Pipeline: {name: 'Astrometry analysis pipeline', owner:  WorkingGroups.workingGroup13},
    Public: {name: 'Public', owner: ExternalGroups.Public},
    msosPhotometryPipeline: {name: 'MSOS photometry', owner: ExternalGroups.MsosPhotometry},
    msosModelingPipeline: {name: 'MSOS modeling', owner: ExternalGroups.MsosModeling},
    socPipeline: {name: 'SOC', owner: ExternalGroups.Soc},
    // rapidPipeline: {name: 'RAPID', owner: ExternalGroups.Rapid},
} satisfies Record<string, Pipeline>;
