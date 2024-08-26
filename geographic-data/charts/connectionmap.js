import { palette } from "../../colours.js"

export const addChart = (chartProps, data, geo) => {
    const { chart, width, height } = chartProps
    const groups = [...new Set(data.nodes.map(d => d.group))]

    const nodeLinks = data.links.map(d => {
        const source = getCoordsFromId(data.nodes, d.source.id)
        const target = getCoordsFromId(data.nodes, d.target.id)

        return {
            type: 'LineString',
            coordinates: [source, target]
        }
    })

    const colour = d3
        .scaleOrdinal()
        .domain(groups)
        .range([palette.blue, palette.amber, palette.bluishGreen, palette.vermillion, palette.reddishPurple, palette.contrasting])


    const projection = d3
        .geoNaturalEarth1()
        .scale(width / 1.8 / Math.PI)
        .translate([width / 2, height / 2])
        .clipExtent([[0, 0], [width, height]])

    const geoPath = d3
        .geoPath()
        .projection(projection)

    chart
        .append('g')
        .selectAll('.map-outline')
        .data(geo.features)
        .join('path')
        .attr('class', 'map-outline')
        .attr('d', geoPath)
        .attr('fill', 'none')
        .attr('stroke-width', 0.25)
        .style('stroke', '#262626')

    chart
        .append('g')
        .selectAll('.node-link')
        .data(nodeLinks)
        .join('path')
        .attr('class', 'node-link')
        .attr('d', geoPath)
        .style('fill', 'none')
        .style('stroke', d3.hsl(palette.axis).brighter(2))
        .style('stroke-width', 1)

    chart
        .append('g')
        .selectAll('.node-point')
        .data(data.nodes)
        .join('circle')
        .attr('class', 'node-points')
        .attr('r', 4)
        .attr('fill', d => colour(d.group))
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 0.1)
        .attr('cx', d => projection([d.longitude, d.latitude])[0])
        .attr('cy', d => projection([d.longitude, d.latitude])[1])
}

function getCoordsFromId(nodes, id) {
    const node = nodes.filter(d => d.id === id)[0]
    return [node.longitude, node.latitude]
}