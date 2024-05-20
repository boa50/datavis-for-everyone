export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.X_VARIABLE).map((d, i) => d * [0.95, 1.05][i]))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.Y_VARIABLE).map((d, i) => d * [0.95, 1.05][i]))
        .range([height, 0])
}