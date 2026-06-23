import type {ExternalGroup} from "../element_data_types/external_group.ts";

export const ExternalGroups = {
    MsosPhotometry: {name: 'MSOS photometry', type: 'ExternalGroup'},
    MsosModeling: {name: 'MSOS modeling', type: 'ExternalGroup'},
    Soc: {name: 'SOC', type: 'ExternalGroup'},
    Mast: {name: 'MAST', type: 'ExternalGroup'},
    Public: {name: 'Public', type: 'ExternalGroup'},
} satisfies Record<string, ExternalGroup>;
