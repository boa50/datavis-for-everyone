import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette as paletteLightBg, paletteDarkBg } from "../../colours.js"

export const addChart = (chartProps, data, theme = 'light') => {
    const { chart, width, height } = chartProps
    const palette = theme === 'light' ? paletteLightBg : paletteDarkBg

    const x = d3
        .scaleBand()
        .domain(data.map(d => d.group))
        .range([0, width])
        .padding(.25)

    const y = d3
        .scaleLinear()
        .domain([0, d3.quantile(data.map(d => d.govSpending), 0.995) * 1.05])
        .range([height, 0])

    const bins = d3
        .bin()
        .domain(y.domain())
        .thresholds(y.ticks(20))
        .value(d => d.govSpending)

    const groups = [...new Set(data.map(d => d.group))]

    const dataGrouped = groups.map(grp => { return { group: grp, bins: bins(data.filter(d => d.group === grp)) } })

    const maxLength = d3.max(dataGrouped.map(d => d3.max(d.bins.map(d => d.length))))

    const xLength = d3.scaleLinear()
        .range([0, x.bandwidth()])
        .domain([-maxLength, maxLength])

    const area = d3.area()
        .x0(d => xLength(-d.length))
        .x1(d => xLength(d.length))
        .y(d => y(d.x0))
        .curve(d3.curveCatmullRom)

    chart
        .selectAll('.data-point')
        .data(dataGrouped)
        .join('g')
        .attr('transform', d => `translate(${x(d.group)}, 0)`)
        .append('path')
        .datum(d => d.bins)
        .attr('fill', palette.blue)
        .attr('d', area)

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y,
        yNumTicks: 5,
        yNumTicksForceInitial: true
    })
}