import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import type {DataFlow} from "../../../element_data_types/data_flow.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.workingGroup6Pipeline,
    destinationPipelines: [pipelineNodeDefinitions.Public],
    data: {
        name: 'Simulated variable star light curves',
        isOfficialPitPublicDataProduct: true,
        narrativeDescription: 'The Variable Light Curves Working Group (Working Group 6) has generated a self-consistent library of variable star lightcurves with a Roman noise model that can be used to test microlensing classifier software. Some primary objectives of this work are, (1) compile catalogs of real variable star light curves from prior surveys in the GBTDS footprint, (2) generate a catalog of simulated light curves, (3) resample the light curves to mimic GBTDS-like sensitivity, cadence, etc, and finally (4) transform the resampled light curves from the original passbands to the primary filters that the GBTDS will utilize. The stellar variability types that currently exist in the catalog are as follows:\n' +
            '\n<ul class="list-disc list-outside px-5">' +
            '<li>RR Lyraes</li>' +
            '<li>Long Period Variables (i.e., Miras)</li>' +
            '<li>Ellipsoidal Binaries</li>' +
            '<li>Eclipsing Binaries</li>' +
            '<li>Delta Scuti</li>' +
            '<li>Heartbeat Stars</li>' +
            '<li>Cepheids (type 1 and type 2)</li>' +
            '<li>M-dwarf flares</li>' +
            '<li>Cataclysmic Variables</li>' +
            '</ul>',
    },
} satisfies DataFlow;
