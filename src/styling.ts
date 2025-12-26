import type {StylesheetStyle} from "cytoscape";
import {EdgeTypeStyleClass, NodeTypeStyleClass} from "./graphTypes.ts";

export function getDefaultAppStyle(): StylesheetStyle[] {
        return [
            {
                selector: 'node',
                style: {
                    label: 'data(name)',
                    width: 'data(width)',
                    height: 'data(height)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'text-wrap': 'wrap',
                    'text-max-width': '140',
                    'border-width': '1px',
                    'border-style': 'solid',
                    'border-color': '#000000',
                    'font-size': '16px',
                }
            },
            {
                selector: `.${NodeTypeStyleClass.WorkingGroupPipeline}`,
                style: {
                    shape: 'rectangle',
                    'background-color': '#C0BFFB',
                },
            },
            {
                selector: `.${NodeTypeStyleClass.ExternalGroupPipeline}`,
                style: {
                    shape: 'rectangle',
                    'background-color': '#CCCCCC',
                },
            },
            {
                selector: `.${NodeTypeStyleClass.Public}`,
                style: {
                    shape: 'rectangle',
                    'background-color': '#F6C1FC',
                },
            },
            {
                selector: `.${NodeTypeStyleClass.DataLeaf}, .${NodeTypeStyleClass.DataTree}`,
                style: {
                    shape: 'round-rectangle',
                    'corner-radius': '20px',
                    'background-color': '#FFFFC5',
                },
            },
            {
                selector: `.${NodeTypeStyleClass.DataFlow}`,
                style: {
                    shape: 'round-rectangle',
                    'corner-radius': '20px',
                    'background-color': '#CCFEC6',
                },
            },
            {
                selector: 'edge',
                style: {
                    'width': 1.2,
                    'line-color': '#000000',
                    'line-cap': 'square',
                    'curve-style': 'bezier',
                }
            },
            {
                selector: `.${EdgeTypeStyleClass.DataFlow}`,
                style: {
                    'target-arrow-color': '#000000',
                    'target-arrow-shape': 'triangle',
                    'arrow-scale': 1.2,
                    'line-style': 'dashed',
                    'line-dash-pattern': [10, 10],
                }
            },
            {
                selector: `.${EdgeTypeStyleClass.DataFlow}`,
                style: {}
            },
            {
                selector: `.selected-node`,
                style: {
                    'border-width': '2px',
                }
            },
        ];
    }