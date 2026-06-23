import {pipelines} from "../../pipelines.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelines.workingGroup13Pipeline,
    destinationPipelines: [pipelines.Public],
    data: {
        name: 'Joint photometric and astrometric fit of model',
        unit: 'For each event',
        notes: 'Containing proper motion + parallax + microlensing.',
        dataElements: [
            {
                name: 'Posterior states',
                structure: 'Table of (parameter values [which parameters?], likelihood, prior probability, weight)',
            },
            {
                name: 'Best-fit quantities and uncertainties from fit',
                structure: '(parameter values [which parameters?], likelihood, prior probability, weight)',
                notes: 'Need details here: multi-modal? maxL/MAP/mean/median',
            },
            {
                name: 'Evidence from fit',
                notes: 'Needed for model comparisons.',
            },
        ]
    }
} satisfies DataFlow;
