import {dataFlows, pipelineNodeDefinitions} from './elementEntries';

export function renderPublicDataTable(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const publicFlows = dataFlows.filter(flow =>
        flow.destinationPipelines.some(dest => dest === pipelineNodeDefinitions.Public)
    );

    // Collect only flows that have at least one official public data product element
    const officialFlows = publicFlows.filter(flow => {
        const data = flow.data as any;
        const dataElements = data.dataElements || [{name: '(Main Data)', ...data}];
        return dataElements.some((el: any) =>
            el.isOfficialPitPublicDataProduct ?? data.isOfficialPitPublicDataProduct
        );
    });

    let html = `<div class="p-8 max-w-7xl mx-auto">
        <h1 class="text-2xl font-bold mb-8 text-gray-800 border-b pb-2">Official RGES-PIT Public Data Release Data Products</h1>`;

    // ── Per-flow narrative sections ──
    officialFlows.forEach(flow => {
        const data = flow.data as any;
        const dataElements = data.dataElements || [{name: '(Main Data)', ...data}];
        const sourcePipelineName = flow.sourcePipeline.data.information.name || 'Unknown Source';
        const dataCollectionName = data.name || 'Unnamed Group';
        const narrative = data.narrativeDescription;

        const publicElements = dataElements.filter((el: any) =>
            el.isOfficialPitPublicDataProduct ?? data.isOfficialPitPublicDataProduct
        );

        if (publicElements.length === 0) return;

        html += `
        <section class="mb-10">
            <h2 class="text-xl font-bold text-gray-800 mb-1">${dataCollectionName}</h2>
            <p class="text-sm text-gray-500 mb-3">Source pipeline: ${sourcePipelineName}${data.host ? ` · Host: ${data.host}` : ''}</p>
            ${narrative ? `<div class="prose prose-sm max-w-none text-gray-700 mb-4">${narrative}</div>` : ''}
            ${data.notes ? `<div class="text-sm italic text-gray-500 bg-gray-50 p-3 rounded border-l-4 border-blue-200 mb-4">Notes: ${data.notes}</div>` : ''}

            <div class="overflow-hidden border border-gray-300 rounded-lg shadow-sm mb-2">
                <table class="min-w-full border-collapse text-sm bg-white table-fixed">
                    <thead class="bg-gray-100 border-b border-gray-300">
                        <tr>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider w-[30%]">Data Product</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider w-[70%]">Details</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">`;

        publicElements.forEach((element: any) => {
            const unit = element.unit ?? data.unit;
            const frequency = element.frequency ?? data.frequency;
            const latency = element.latency ?? data.latency;
            const host = element.host ?? data.host;

            html += `
                        <tr class="hover:bg-blue-50 transition-colors">
                            <td class="p-3 align-top font-semibold text-blue-800 w-[30%]">${element.name}</td>
                            <td class="p-3 align-top w-[70%]">
                                <div class="space-y-2">
                                    <div class="flex flex-col gap-y-1">
                                        ${unit ? `<div class="block"><span class="text-xs font-bold text-gray-400 uppercase mr-1">Unit:</span> ${unit}</div>` : ''}
                                        ${frequency ? `<div class="block"><span class="text-xs font-bold text-gray-400 uppercase mr-1">Frequency:</span> ${frequency}</div>` : ''}
                                        ${latency ? `<div class="block"><span class="text-xs font-bold text-gray-400 uppercase mr-1">Latency:</span> ${latency}</div>` : ''}
                                        ${element.format ? `<div class="block"><span class="text-xs font-bold text-gray-400 uppercase mr-1">Format:</span> ${element.format}</div>` : ''}
                                        ${element.structure ? `<div class="block"><span class="text-xs font-bold text-gray-400 uppercase mr-1">Structure:</span> ${element.structure}</div>` : ''}
                                        ${host ? `<div class="block"><span class="text-xs font-bold text-gray-400 uppercase mr-1">Host:</span> ${host}</div>` : ''}
                                    </div>

                                    ${(element.totalNumberOfUnits || element.unitDataSize || element.totalDataSize) ? `
                                    <div class="flex flex-col gap-y-1 py-1 px-2 bg-blue-50/50 rounded border border-blue-100 text-xs">
                                        ${element.totalNumberOfUnits ? `<div><span class="font-bold text-blue-400 uppercase">Total Units:</span> ${element.totalNumberOfUnits}</div>` : ''}
                                        ${element.unitDataSize ? `<div><span class="font-bold text-blue-400 uppercase">Unit Size:</span> ${element.unitDataSize}</div>` : ''}
                                        ${element.totalDataSize ? `<div><span class="font-bold text-blue-400 uppercase">Total Size:</span> ${element.totalDataSize}</div>` : ''}
                                    </div>
                                    ` : ''}

                                    ${element.exampleFileUrl ? `<div><a href="${element.exampleFileUrl}" class="text-xs text-blue-600 hover:underline flex items-center">Example File</a></div>` : ''}
                                    ${element.notes ? `<div class="mt-2 text-xs italic text-gray-500 bg-gray-50 p-2 rounded border-l-4 border-blue-200">Notes: ${element.notes}</div>` : ''}
                                </div>
                            </td>
                        </tr>`;
        });

        html += `
                    </tbody>
                </table>
            </div>
        </section>`;
    });

    // ── Full detail table with all data elements ──
    html += `
            <h1 class="text-2xl font-bold mt-12 mb-4 text-gray-800 border-b pb-2">All Data Products Table</h1>
            <div class="overflow-x-auto border border-red-200 rounded-lg shadow-md">
                <table class="min-w-full border-collapse text-sm bg-red-50/40">
                    <thead class="bg-red-100 border-b border-red-200">
                        <tr>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Data Collection</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Data Product</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Source Pipeline</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider min-w-[120px]">Unit</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Frequency</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Latency</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Format</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Structure</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Host</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider min-w-[200px]">Total Units</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Unit Size</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Total Size</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Example File</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-red-100">
        `;

    publicFlows.forEach(flow => {
        const data = flow.data as any;
        const dataElements = data.dataElements || [{name: '(Main Data)', ...data}];
        const sourcePipelineName = flow.sourcePipeline.data.information.name || 'Unknown Source';
        const dataCollectionName = data.name || 'Unnamed Group';

        dataElements.forEach((element: any) => {
            const isOfficialPitPublicDataProduct = element.isOfficialPitPublicDataProduct ?? data.isOfficialPitPublicDataProduct;
            if (!isOfficialPitPublicDataProduct) {
                return;
            }
            // Inherit properties from the parent if available and missing in the element
            const unit = element.unit ?? data.unit ?? '';
            const frequency = element.frequency ?? data.frequency ?? '';
            const latency = element.latency ?? data.latency ?? '';
            const host = element.host ?? data.host ?? '';

            html += `
                <tr class="hover:bg-red-50 transition-colors">
                    <td class="p-3 align-top text-gray-600">${dataCollectionName}</td>
                    <td class="p-3 align-top font-semibold text-blue-800">${element.name}</td>
                    <td class="p-3 align-top font-medium text-gray-900">${sourcePipelineName}</td>
                    <td class="p-3 align-top text-gray-600 min-w-[120px]">${unit}</td>
                    <td class="p-3 align-top text-gray-600">${frequency}</td>
                    <td class="p-3 align-top text-gray-600">${latency}</td>
                    <td class="p-3 align-top text-gray-600">${element.format ?? ''}</td>
                    <td class="p-3 align-top text-gray-600">${element.structure ?? ''}</td>
                    <td class="p-3 align-top text-gray-600">${host}</td>
                    <td class="p-3 align-top text-gray-600 min-w-[200px]">${element.totalNumberOfUnits ?? ''}</td>
                    <td class="p-3 align-top text-gray-600">${element.unitDataSize ?? ''}</td>
                    <td class="p-3 align-top text-gray-600">${element.totalDataSize ?? ''}</td>
                    <td class="p-3 align-top">${element.exampleFileUrl ? `<a href="${element.exampleFileUrl}" class="text-xs text-blue-600 hover:underline">Example File</a>` : ''}</td>
                </tr>
            `;
        });
    });

    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;

    container.innerHTML = html;
}