import type {EdgeCollection} from "cytoscape";

export async function marchingAntsAnimationForEdges(edges: EdgeCollection) {
    // TODO: There appears to be a small jitter on each iteration. The 10 second duration is probably an ok fix, but
    //       figuring out how to actually make it smooth might be better.
    const speed = 300
    const duration = 10000
    let step = 0
    // noinspection InfiniteLoopJS
    while (true) {
        step += 1
        const style = {
            'line-dash-pattern': [10, 10],
            'line-dash-offset': -speed * step,
        }
        await new Promise<void>((resolve) => {
            edges.animate({
                style: style,
                duration: duration,
                queue: false,
                complete: () => resolve()
            });
        });
    }
}