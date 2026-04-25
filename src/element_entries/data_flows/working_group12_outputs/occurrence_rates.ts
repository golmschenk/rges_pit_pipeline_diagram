import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup12Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.Public],
    data: {
        name: 'Occurrence rates',
        host: 'Exoplanet Archive',
        isOfficialPitPublicDataProduct: true,
        notes: 'The PIT will provide preliminary occurrence rates, including upper limits where appropriate, using the above products across a grid of 0.1Me < m < 30MJup and 1 < a < 10 au, assuming an appropriate distribution of stellar masses, and assess progress towards meeting the baseline science requirements.',
    }
} satisfies DataFlowData;
