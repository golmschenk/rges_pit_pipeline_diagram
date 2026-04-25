import type {DataFlowData} from "../../../graphTypes.ts";
import {pipelineNodeDefinitions} from "../../pipeline_definitions.ts";

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
        notes: 'Initial catalog of sources:<br><ul class="list-disc list-outside px-5">' +
            '<li>Catalog is built with PSF photometry (one product)</li>' +
            '<li>Take one week of data</li>' +
            '<li>~ 700 images</li>' +
            '<li>Averaging, etc.</li>' +
            '<li>Visible sources survive</li>' +
            '<li>There will be the equivalent of the TIC numbers</li>' +
            '<li>Pretty complete down to 25 magnitude</li>' +
            '<li>Catalog is fixed, but update parameters of each source every eight days</li>' +
            '<li>Sources may get added throughout season, then reprocessing at the end of the season for things missed early in the season</li>' +
            '<li>MSOS releases nothing for the first month of the first season</li>' +
            '<li>At 30 days, we get the catalog and we get the light curve for those 30 days</li>' +
            '</ul><br>' +
            'Will not produce the light curves themselves. Will hand these data points off to the SOC every 2 ' +
            'days and expects the SOC to stitch together the light curves and release them. They will also not ' +
            'directly release these data points. This also goes to through the SOC. The SOC is expected to ' +
            'release the data "promptly" after receiving it. Unclear if the SOC intends to make the individual ' +
            'data point tables available or just the resulting light curves after stitching.'
        ,
        dataElements: [
            {
                name: 'PSF photometry data points',
                notes: 'Single star fit to catalog position, single star fit with floating centroid, multiple ' +
                    'star fit with fixed centroid (week before location)'
            },
            {
                name: 'DIA photometry data points',
                notes: '<ul class="list-disc list-outside px-5">' +
                    '<li>Fixed centroid, and floating centroid</li>' +
                    '<li>Against 8 day stack from first week of season (challenges here— proper motion over' +
                    ' season, if the thing was already changing during stack [long duration event], bad DIA)</li>' +
                    '</ul>'
            },
        ]
    },
} satisfies DataFlowData;
