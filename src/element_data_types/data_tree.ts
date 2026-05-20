import type {DataLeaf} from "./data_leaf.ts";

export type DataTree = {
    name: string
    unit?: string
    frequency?: string
    latency?: string
    dataElements: (DataTree | DataLeaf)[]
    notes?: string
    host?: string
    unitDataSize?: string
    totalNumberOfUnits?: string
    totalDataSize?: string
    dataReleaseFrequency?: string
    isOfficialPitPublicDataProduct?: boolean
    narrativeDescription?: string
}