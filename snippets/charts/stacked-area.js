const keys = ['GROUPS TO BE STACKED']

const colour = d3
    .scaleOrdinal()
    .domain(keys)
    .range(['GROUPS COLOURS'])

const stackedData = d3
    .stack()
    .keys(keys)
    (data)

const area = d3
    .area()
    .x(d => x(d.data.X_AXIS_FIELD))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))

chart
    .selectAll('.stacks')
    .data(stackedData)
    .join('path')
    .attr('fill', d => colour(d.key))
    .attr('d', area)