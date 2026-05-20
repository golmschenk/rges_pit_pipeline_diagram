import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";
import notes from './photometry_data_points_resources/notes.md?raw';
import dia_photometry_data_points_notes from './photometry_data_points_resources/dia_photometry_data_points_notes.md?raw'
import {from_markdown} from "../../../markdown.ts";

export default {
    sourcePipeline: pipelineNodeDefinitions.msosPhotometryPipeline,
    destinationPipelines: [pipelineNodeDefinitions.socPipeline],
    data: {
        name: 'Photometry data points',
        unit: 'Per source in input catalog',
        frequency: 'After each Roman image',
        latency: 'Within 2 days',
        structure: 'Table of (x, y, flux/mag, xerr, yerr, magerr, t) for all time steps, all filters, ' +
            'cross-matched across all seasons',
        notes: from_markdown(notes),
        dataElements: [
            {
                name: 'PSF photometry data points',
                notes: 'Single star fit to catalog position, single star fit with floating centroid, multiple ' +
                    'star fit with fixed centroid (week before location)'
            },
            {
                name: 'DIA photometry data points',
                notes: from_markdown(dia_photometry_data_points_notes)
            },
        ]
    },
} satisfies DataFlowData;
