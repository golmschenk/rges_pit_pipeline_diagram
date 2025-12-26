import type {Core, NodeSingular, Position} from "cytoscape";
import type {ViewType} from "./app.ts";

export function updateNodeDimensions(node: cytoscape.NodeSingular) {
    const minimumWidth = 180;
    const minimumHeight = 90;
    const padding = 0;
    const bbox = node.boundingBox();
    const width = Math.max(minimumWidth, bbox.w + padding);
    const height = Math.max(minimumHeight, bbox.h + padding);
    node.data('width', width);
    node.data('height', height);
}


export function offsetPositions(positions: Record<string, Position>, offset: Position): Record<string, Position> {
    let updatedPositions: Record<string, Position> = {}
    Object.entries(positions).forEach(([key, position]) => {
        updatedPositions[key] = {
            x: position.x + offset.x,
            y: position.y + offset.y
        }
    })
    return updatedPositions
}

export function getNodePositions(nodes: cytoscape.NodeCollection) {
    return Object.fromEntries(
        nodes.map(node => [node.id(), {x: node.position().x, y: node.position().y}])
    );
}
