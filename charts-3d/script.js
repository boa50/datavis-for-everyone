// Based on: https://jsfiddle.net/qkHK6/2987/
import { getChart } from "../components/utils.js"

const data = [
    { label: 'A', value: 36, color: '#3366CC' },
    { label: 'B', value: 26, color: '#DC3912' },
    { label: 'C', value: 13, color: '#FF9900' },
    { label: 'D', value: 7, color: '#109618' },
    { label: 'E', value: 8, color: '#990099' },
    { label: 'F', value: 10, color: '#934099' }
]

const rx = 230, ry = 100, ir = 0;

const svgHeight = (window.innerHeight
    - document.getElementById('header').offsetHeight
    - document.getElementById('caption').offsetHeight) / 2
    - 64

const { chart, width, height, margin } = getChart(
    'chart1',
    document.getElementById('chart1-container').offsetWidth,
    svgHeight
)

chart
    .data([data])
    .attr('transform', `translate(${[width / 2, height / 2]})`)

const pieHeight = height - 250

const pie = d3.pie().value(d => d.value)

chart
    .selectAll('.innerSlice')
    .data(pie)
    .join('path')
    .attr('class', 'innerSlice')
    .style('fill', d => d3.hsl(d.data.color).darker(0.7))
    .attr('d', d => pieInner(d, rx + 0.5, ry + 0.5, pieHeight, ir))
    .each(function (d) { this._current = d; })

chart
    .selectAll('.topSlice')
    .data(pie)
    .join('path')
    .attr('class', 'topSlice')
    .style('fill', d => d.data.color)
    .style('stroke', d => d.data.color)
    .attr('d', d => pieTop(d, rx, ry, ir))
    .each(function (d) { this._current = d; })

chart
    .selectAll('.outerSlice')
    .data(pie)
    .join('path')
    .attr('class', 'outerSlice')
    .style('fill', d => d3.hsl(d.data.color).darker(0.7))
    .attr('d', d => pieOuter(d, rx - .5, ry - .5, pieHeight))
    .each(function (d) { this._current = d; })

// chart
//     .selectAll('.percent')
//     .data(pie)
//     .join('text')
//     .attr('class', 'percent')
//     .attr('x', d => 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle)))
//     .attr('y', d => 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle)))
//     .text(getPercent)
//     .each(function (d) { this._current = d; })

function pieInner(d, rx, ry, h, ir) {
    var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
    var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

    var sx = ir * rx * Math.cos(startAngle),
        sy = ir * ry * Math.sin(startAngle),
        ex = ir * rx * Math.cos(endAngle),
        ey = ir * ry * Math.sin(endAngle);

    var ret = [];
    ret.push('M', sx, sy, 'A', ir * rx, ir * ry, '0 0 1', ex, ey, 'L', ex, h + ey, 'A', ir * rx, ir * ry, '0 0 0', sx, h + sy, 'z');
    return ret.join(' ');
}

function pieTop(d, rx, ry, ir) {
    if (d.endAngle - d.startAngle == 0) return 'M 0 0';
    var sx = rx * Math.cos(d.startAngle),
        sy = ry * Math.sin(d.startAngle),
        ex = rx * Math.cos(d.endAngle),
        ey = ry * Math.sin(d.endAngle);

    var ret = [];
    ret.push('M', sx, sy, 'A', rx, ry, '0', (d.endAngle - d.startAngle > Math.PI ? 1 : 0), '1', ex, ey, 'L', ir * ex, ir * ey);
    ret.push('A', ir * rx, ir * ry, '0', (d.endAngle - d.startAngle > Math.PI ? 1 : 0), '0', ir * sx, ir * sy, 'z');
    return ret.join(' ');
}

function pieOuter(d, rx, ry, h) {
    var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
    var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);

    var sx = rx * Math.cos(startAngle),
        sy = ry * Math.sin(startAngle),
        ex = rx * Math.cos(endAngle),
        ey = ry * Math.sin(endAngle);

    var ret = [];
    ret.push('M', sx, h + sy, 'A', rx, ry, '0 0 1', ex, h + ey, 'L', ex, ey, 'A', rx, ry, '0 0 0', sx, sy, 'z');
    return ret.join(' ');
}

function getPercent(d) {
    return (d.endAngle - d.startAngle > 0.2 ?
        Math.round(1000 * (d.endAngle - d.startAngle) / (Math.PI * 2)) / 10 + '%' : '');
}	