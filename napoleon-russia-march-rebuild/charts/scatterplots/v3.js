import { colours } from '../../constants.js'

export const scatterplotV3 = (chart, width, height, data, cities, geo, groupSymbol, size, colour, tooltips) => {
    const { mouseover, mousemove, mouseleave } = tooltips

    const fontSize = d3
        .scaleOrdinal()
        .domain(['city', 'country'])
        .range([11, 25])

    const projection = d3
        .geoMercator()
        .center([31, 55])
        .scale(4080)
        .translate([width / 2, height / 2])
        .clipExtent([[0, 0], [width, height]])

    chart
        .append('g')
        .selectAll('path')
        .data(geo.features)
        .join('path')
        .attr('fill', '#ffffff')
        .attr('d', d3.geoPath()
            .projection(projection)
        )
        .style('stroke', '#9ca3af')

    chart
        .selectAll('.cities')
        .data(cities)
        .join('text')
        .attr('transform', d => `translate(${projection([d.long, d.lat])})`)
        .attr('font-size', d => fontSize(d.type))
        .attr('fill', colours.text)
        .text(d => d.city)

    chart
        .selectAll('.dt-points')
        .data(data)
        .join('path')
        .attr('d', d3.symbol().type(d => groupSymbol(d.group)).size(d => Math.pow(size(d.deaths), 2) * Math.PI))
        .attr('transform', d => `translate(${projection([d.long, d.lat])})`)
        .style('fill', d => colour(d.direction))
        .style('fill-opacity', 0.4)
        .style('stroke', d => colour(d.direction))
        .attr('stroke-width', 0.5)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)
}