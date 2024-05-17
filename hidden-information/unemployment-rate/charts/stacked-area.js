import { colours } from "../constants.js"
import { addAxis } from "../../../components/axis/script.js"
import { addLegend } from "../../../components/legend/script.js"
import { addVerticalTooltip as addTooltip, removeVerticalTooltip as removeTooltip } from "../../../components/tooltip/script.js"
import { formatDate } from "../../../components/utils.js"

export const updateChart = ({ data, chart, width, height, x, y, colour, keys }) => {
    removeTooltip(chart)
    d3.select('#chart2-container').select('.tooltip').remove()

    const stackedData = d3
        .stack()
        .keys(keys)
        (data)

    const area = d3
        .area()
        .x(d => x(d.data.measureDate))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))

    chart
        .selectAll('.stacks')
        .data(stackedData)
        .join('path')
        .attr('class', 'stacks')
        .attr('fill', d => colour(d.key))
        .transition()
        .attr('d', area)

    const tooltipData = {}

    for (let i = 0; i < stackedData[0].length; i++) {
        tooltipData[data[i].measureDate.getTime()] = {
            x: data[i].measureDate,
            ys: stackedData.map(stack => stack[i][1]),
            outOfWorkforce: data[i].outOfWorkforce,
            working: data[i].working,
            notWorking: data[i].notWorking
        }
    }

    addTooltip({
        id: 'chart2-container',
        htmlText: d => `
        <strong>${formatDate(d.x)}</strong> 
        <div style="display: flex; justify-content: space-between">
            <span>Not Working:&emsp;</span>
            <span>${d3.format('.2s')(d.notWorking)}</span>
        </div>  
        <div style="display: flex; justify-content: space-between">
            <span>Working:&emsp;</span>
            <span>${d3.format('.2s')(d.working)}</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Out of Workforce:&emsp;</span>
            <span>${d3.format('.2s')(d.outOfWorkforce)}</span>
        </div>
        `,
        chart,
        width,
        height,
        x,
        y,
        colour: colours.lineTooltip,
        data,
        xVariable: 'measureDate',
        tooltipData,
        keyFunction: d => d.getTime()
    })
}

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const x = d3
        .scaleTime()
        .domain(d3.extent(data, d => d.measureDate))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, 180 * 1e6])
        .range([height, 0])

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Population',
        yFormat: d3.format('.2s'),
        colour: colours.axis,
        hideYdomain: true
    })

    const keys = ['outOfWorkforce', 'notWorking', 'working']

    const colour = d3
        .scaleOrdinal()
        .domain(keys)
        .range([colours.outOfWorkforce, colours.notWorking, colours.working])

    addLegend({
        chart,
        legends: ['Working', 'Not Working', 'Out of Workforce'],
        colours: [colours.working, colours.notWorking, colours.outOfWorkforce],
        xPosition: -64,
        yPosition: -20
    })

    const chartObject = { data, chart, width, height, x, y, colour, keys }

    updateChart(chartObject)

    return chartObject
}