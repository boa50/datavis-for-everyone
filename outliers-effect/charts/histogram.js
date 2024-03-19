//Based on https://d3-graph-gallery.com/graph/histogram_basic.html
import { width, height, svgWidth, svgHeight, margin } from "../constants.js"

let chart, xAxis, yAxis

export const plotHistogram = (id, data) => {
    const svg = d3
        .select(`#${id}`)
        .attr('width', svgWidth)
        .attr('height', svgHeight)

    chart = svg
        .append('g')
        .attr('transform', `translate(${[margin.left, margin.top]})`)

    xAxis = chart.append('g')
        .attr('transform', `translate(0, ${height})`)

    yAxis = chart.append('g')

    updateHistogram(data)
}

export const updateHistogram = data => {

    const x = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([0, width])

    const histogram = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(50))

    const bins = histogram(data)

    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0])

    xAxis.call(d3.axisBottom(x))
    yAxis.call(d3.axisLeft(y))

    chart.selectAll('rect')
        .data(bins)
        .join('rect')
        .attr('x', 1)
        .attr('transform', d => `translate(${x(d.x0)} , ${y(d.length)})`)
        .attr('width', d => x(d.x1) - x(d.x0) - 1)
        .attr('height', d => height - y(d.length))
        .style('fill', '#69b3a2')

}