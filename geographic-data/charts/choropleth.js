export const addChart = (chartProps, data, geo) => {
    const { chart, width, height } = chartProps

    const projection = d3
        // .geoEquirectangular()
        // .scale(width / 2 / Math.PI)
        .geoNaturalEarth1()
        .scale(width / 1.8 / Math.PI)
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
}