import { addVerticalLegend as addLegend } from "../../node_modules/visual-components/index.js"
import { piePalette } from "../constants.js"

// Based on: https://jsfiddle.net/qkHK6/2987/
export const addChart = ({
    chartProps,
    data,
    xRadius = 230,
    yRadius = 100,
    innerRadius = 0,
    rotation = 0,
    pieHeight = 100
}) => {
    const { chart, width, height } = chartProps

    chart.attr('transform', `translate(${[width / 1.5, height / 2.5]})`)

    const pieData = d3
        .pie()
        .value(d => d[1])
        .sort((a, b) => (a, b))
        (Object.entries(data))

    const colour = d3
        .scaleOrdinal()
        .range(piePalette)

    chart
        .selectAll('.innerSlice')
        .data(pieData)
        .join('path')
        .attr('class', 'innerSlice')
        .attr('fill', d => d3.hsl(colour(d.data[0])).darker(0.7))
        .attr('d', d => pieInner(d, xRadius, yRadius, pieHeight, innerRadius, rotation))

    chart
        .selectAll('.topSlice')
        .data(pieData)
        .join('path')
        .attr('class', 'topSlice')
        .attr('fill', d => colour(d.data[0]))
        .attr('stroke', d => colour(d.data[0]))
        .attr('d', d => pieTop(d, xRadius, yRadius, innerRadius, rotation))

    chart
        .selectAll('.outerSlice')
        .data(pieData)
        .join('path')
        .attr('class', 'outerSlice')
        .attr('fill', d => d3.hsl(colour(d.data[0])).darker(0.7))
        .attr('d', d => pieOuter(d, xRadius, yRadius, pieHeight, rotation))

    chart
        .selectAll('.percent')
        .data(pieData)
        .join('text')
        .attr('class', 'percent font-bold text-lg')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('x', d => 0.7 * xRadius * Math.cos(0.5 * (d.startAngle + d.endAngle + rotation * 2)))
        .attr('y', d => 0.7 * yRadius * Math.sin(0.5 * (d.startAngle + d.endAngle + rotation * 2)))
        .text(getPercent)


    addLegend({
        chart,
        legends: Object.keys(data),
        colours: piePalette,
        xPosition: -width / 1.7,
        yPosition: -height / 8
    })
}

function getAngles(startAngle, endAngle, rotation, cutPoint) {
    let start = (startAngle + rotation) % (Math.PI * 2)
    let end = (endAngle + rotation) % (Math.PI * 2)

    switch (cutPoint) {
        case 'min':
            start = Math.min(start, Math.PI)
            end = Math.min(end, Math.PI)
            start = start > end ? 0 : start
            break;
        case 'max':
            start = Math.max(start, Math.PI)
            end = Math.max(end, Math.PI)
            end = start > end ? 0 : end
            break;
        default:
            break;
    }

    return [start, end]
}

function getPiePositions(d, xRadius, yRadius, rotation, cutPoint, innerRadius = 1) {
    const [startAngle, endAngle] = getAngles(d.startAngle, d.endAngle, rotation, cutPoint)
    return [
        innerRadius * xRadius * Math.cos(startAngle),
        innerRadius * yRadius * Math.sin(startAngle),
        innerRadius * xRadius * Math.cos(endAngle),
        innerRadius * yRadius * Math.sin(endAngle)
    ]
}

function pieInner(d, xRadius, yRadius, height, innerRadius, rotation) {
    xRadius += 0.5
    yRadius += 0.5

    const [sx, sy, ex, ey] = getPiePositions(d, xRadius, yRadius, rotation, 'max', innerRadius)

    return [
        'M', sx, sy,
        'A', innerRadius * xRadius, innerRadius * yRadius, '0 0 1', ex, ey,
        'L', ex, height + ey,
        'A', innerRadius * xRadius, innerRadius * yRadius, '0 0 0', sx, height + sy, 'z'
    ].join(' ')
}

function pieTop(d, xRadius, yRadius, innerRadius, rotation) {
    if (d.endAngle - d.startAngle == 0) return 'M 0 0'
    const [sx, sy, ex, ey] = getPiePositions(d, xRadius, yRadius, rotation)

    return [
        'M', sx, sy,
        'A', xRadius, yRadius, '0', (d.endAngle - d.startAngle > Math.PI ? 1 : 0), '1', ex, ey,
        'L', innerRadius * ex, innerRadius * ey,
        'A', innerRadius * xRadius, innerRadius * yRadius, '0', (d.endAngle - d.startAngle > Math.PI ? 1 : 0), '0', innerRadius * sx, innerRadius * sy, 'z'
    ].join(' ')
}

function pieOuter(d, xRadius, yRadius, height, rotation) {
    xRadius -= 0.5
    yRadius -= 0.5

    const [sx, sy, ex, ey] = getPiePositions(d, xRadius, yRadius, rotation, 'min')

    return [
        'M', sx, height + sy,
        'A', xRadius, yRadius, '0 0 1', ex, height + ey,
        'L', ex, ey,
        'A', xRadius, yRadius, '0 0 0', sx, sy, 'z'
    ].join(' ')
}

function getPercent(d) {
    return d.endAngle - d.startAngle > 0 ?
        Math.round(1000 * (d.endAngle - d.startAngle) / (Math.PI * 2)) / 10 + '%' :
        ''
}