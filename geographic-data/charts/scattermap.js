import { getPalette } from "../../node_modules/visual-components/index.js"

export const addChart = (chartProps, data, geo, theme = 'light') => {
    const { chart, width, height } = chartProps
    const palette = getPalette(theme)

    const projection = d3
        .geoNaturalEarth1()
        .scale(width / 1.8 / Math.PI)
        .translate([width / 2, height / 2])
        .clipExtent([[0, 0], [width, height]])

    chart
        .append('g')
        .selectAll('.map-path')
        .data(geo.features)
        .join('path')
        .attr('class', 'map-path')
        .attr('d', d3.geoPath()
            .projection(projection)
        )
        .attr('fill', 'transparent')
        .attr('stroke-width', 0.25)
        .style('stroke', palette.axis)

    chart
        .selectAll('.data-points')
        .data(data)
        .join('circle')
        .attr('class', 'data-points')
        .attr('r', 3)
        .attr('fill', palette.blue)
        .style('opacity', 0.5)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 0.1)
        .attr('cx', d => projection([d.longitude, d.latitude])[0] + (Math.random() - 0.5) * 5)
        .attr('cy', d => projection([d.longitude, d.latitude])[1] + (Math.random() - 0.5) * 5)
}