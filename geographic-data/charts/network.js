import { palette } from '../../colours.js'

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps
    const nodeRadius = 5
    const groups = [...new Set(data.nodes.map(d => d.group))]

    const colour = d3
        .scaleOrdinal()
        .domain(groups)
        .range([palette.blue, palette.amber, palette.bluishGreen, palette.vermillion, palette.reddishPurple, palette.contrasting])


    // Straight line link
    // const link = chart
    //     .append('g')
    //     .attr('class', 'links')
    //     .selectAll('line')
    //     .data(data.links)
    //     .join('line')
    //     .attr('stroke', d3.hsl(palette.axis).brighter(2))

    // Curved line link
    const link = chart
        .append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(data.links)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d3.hsl(palette.axis).brighter(2))

    const node = chart
        .append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(data.nodes)
        .join('circle')
        .attr('r', nodeRadius)
        // .attr('fill', palette.blue)
        .attr('fill', d => colour(d.group))

    d3
        .forceSimulation(data.nodes)
        .force('link', d3.forceLink().id(d => d.id).links(data.links))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.radius))
        .on('tick', ticked)

    function ticked() {
        // Straight line link
        // link
        //     .attr('x1', d => d.source.x)
        //     .attr('y1', d => d.source.y)
        //     .attr('x2', d => d.target.x)
        //     .attr('y2', d => d.target.y)

        // Curved line link
        link
            .attr('d', d => {
                let dx = d.target.x - d.source.x
                let dy = d.target.y - d.source.y
                // let dr = Math.sqrt(dx * dx + dy * dy) * Math.random()
                let dr = Math.sqrt(dx * dx + dy * dy)

                return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
            })

        node
            .attr('cx', d => d.x = Math.max(nodeRadius, Math.min(width - nodeRadius, d.x)))
            .attr('cy', d => d.y = Math.max(nodeRadius, Math.min(height - nodeRadius, d.y)))
    }
}