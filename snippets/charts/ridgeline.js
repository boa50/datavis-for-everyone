const y = d3
    .scaleBand()
    .domain(GROUPS)
    .range([0, height])
    .paddingInner(1)

const dataPerGroup = d3.group(data, d => d.GROUP)

const area = data => {
    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.Y_VALUE))
        .range([height, height * CUSTOM_MULTIPLIER])

    return d3
        .area()
        .curve(d3.curveBasis)
        .x(d => x(d.X_VALUE))
        .y0(height)
        .y1(d => y(d.Y_VALUE))
        (data)
}

chart
    .selectAll('.ridge-lane')
    .data(dataPerGroup)
    .join('path')
    .attr('class', 'ridge-lane')
    .attr('transform', d => `translate(0, ${(y(d[0]) - height)})`)
    .datum(d => d[1])
    .attr('fill', FILL_COLOUR)
    .attr('stroke', STROKE_COLOUR)
    .attr('stroke-width', 1)
    .attr('d', area)