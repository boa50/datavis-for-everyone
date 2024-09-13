import { addHighlightTooltip, getPalette } from '../../node_modules/visual-components/index.js'
import { linksHighlight, getNumLinks } from './utils.js'

export const addChart = (chartProps, data, geo, theme = 'light') => {
    const { chart, width, height } = chartProps
    const palette = getPalette(theme)
    const groups = [...new Set(data.nodes.map(d => d.group))]

    const nodeLinks = data.links.map(d => {
        const source = getCoordsFromId(data.nodes, d.source.id)
        const target = getCoordsFromId(data.nodes, d.target.id)

        return {
            type: 'LineString',
            coordinates: [source, target],
            source: d.source.id,
            target: d.target.id
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

    const mapProjection = chart
        .append('g')
        .selectAll('.map-outline')
        .data(geo.features)
        .join('path')
        .attr('class', 'map-outline')
        .attr('d', geoPath)
        .attr('fill', 'none')
        .attr('stroke-width', 0.25)
        .style('stroke', palette.axis)

    const link = chart
        .append('g')
        .selectAll('.node-link')
        .data(nodeLinks)
        .join('path')
        .attr('class', 'node-link')
        .attr('d', geoPath)
        .style('fill', 'none')
        .style('stroke', d3.hsl(palette.axis).brighter(1))
        .style('stroke-width', 1)
        .attr('data-link-source', d => d.source)
        .attr('data-link-target', d => d.target)

    const node = chart
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
        .attr('data-id', d => d.id)

    addHighlightTooltip({
        chart,
        htmlText: d => `
            <div style="display: flex; justify-content: space-between">
                <span>Connections:&emsp;</span>
                <span>${getNumLinks(chart, d)}</span>
            </div>
            `,
        elements: node,
        fadeHighlightElements: d3.selectAll([...node, ...link, ...mapProjection]),
        initialOpacity: 1,
        fadedOpacity: 0.15,
        chartWidth: width,
        chartHeight: height,
        highlightFunction: linksHighlight
    })
}

function getCoordsFromId(nodes, id) {
    const node = nodes.filter(d => d.id === id)[0]
    return [node.longitude, node.latitude]
}