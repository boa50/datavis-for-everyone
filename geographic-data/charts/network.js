import { palette } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps
    const nodeRadius = 5

    const link = chart
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.links)
        .join('line')
        .style('stroke', d3.hsl(palette.axis).brighter(2))

    const node = chart
        .append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(data.nodes)
        .join('circle')
        .attr('r', nodeRadius)
        .style('fill', palette.blue)

    d3
        .forceSimulation(data.nodes)
        .force('link', d3.forceLink().id(d => d.id).links(data.links))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.radius))
        .on('tick', ticked)

    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)

        node
            .attr('cx', d => d.x = Math.max(nodeRadius, Math.min(width - nodeRadius, d.x)))
            .attr('cy', d => d.y = Math.max(nodeRadius, Math.min(height - nodeRadius, d.y)))
    }
}