import { dataFlows, pipelineNodeDefinitions } from './elementEntries';

export function renderPublicDataTable(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const publicFlows = dataFlows.filter(flow =>
        flow.destinationPipelines.some(dest => dest === pipelineNodeDefinitions.Public)
    );

    let html = `
        <div class="p-8 max-w-7xl mx-auto">
            <h1 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">RGES-PIT Public Data</h1>
            <div class="overflow-hidden border border-gray-300 rounded-lg shadow-md">
                <table class="min-w-full border-collapse text-sm bg-white">
                    <thead class="bg-gray-100 border-b border-gray-300">
                        <tr>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Source Pipeline</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Data Collection</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Data Product</th>
                            <th class="p-3 text-left font-bold text-gray-600 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
    `;


        publicFlows.forEach(flow => {
            const data = flow.data as any;
            const dataElements = data.dataElements || [{ name: '(Main Data)', ...data }];
            const sourcePipelineName = flow.sourcePipeline.data.information.name || 'Unknown Source';
            const dataCollectionName = data.name || 'Unnamed Group';

                dataElements.forEach((element: any) => {
                    // Inherit properties from parent if available and missing in the element
                    const unit = element.unit ?? data.unit;
                    const frequency = element.frequency ?? data.frequency;
                    const latency = element.latency ?? data.latency;
                    const host = element.host ?? data.host;

                    html += `
                        <tr class="hover:bg-blue-50 transition-colors">
                            <td class="p-3 align-top font-medium text-gray-900">${sourcePipelineName}</td>
                            <td class="p-3 align-top text-gray-600">${dataCollectionName}</td>
                            <td class="p-3 align-top font-semibold text-blue-800">${element.name}</td>
                                <td class="p-3 align-top">
                                    <div class="space-y-2">
                                        <div class="flex flex-col gap-y-1">
                                            ${unit ? `<div class="block"><span class="text-xs font-bold text-gray-400 uppercase mr-1">Unit:</span> ${unit}</div>` : ''}
                                            ${frequency ? `<div class="block"><span class="text-xs font-bold text-gray-400 uppercase mr-1">Frequency:</span> ${frequency}</div>` : ''}
                                            ${latency ? `<div class="block"><span class="text-xs font-bold text-gray-400 uppercase mr-1">Latency:</span> ${latency}</div>` : ''}
                                            ${element.format ? `<div class="block"><span class="text-xs font-bold text-gray-400 uppercase mr-1">Format:</span> <span class="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs">${element.format}</span></div>` : ''}
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

                                ${element.exampleFileUrl ? `<div><a href="${element.exampleFileUrl}" class="text-xs text-blue-600 hover:underline flex items-center">🔗 Example File</a></div>` : ''}
                                ${element.notes ? `<div class="mt-2 text-xs italic text-gray-500 bg-gray-50 p-2 rounded border-l-4 border-blue-200">Notes: ${element.notes}</div>` : ''}
                            </div>
                        </td>
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