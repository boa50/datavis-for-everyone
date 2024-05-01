import { colours } from "../constants.js"
import { addAxis } from "../../../components/axis/script.js"
import { addLegendV2 as addLegend } from "../../../components/legend/script.js"
import { addTooltip } from "../../../components/tooltip/script.js"
import { formatDate } from "../../../components/utils.js"

export const plotChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

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

    const keys = ['outOfWorkforce', 'working', 'notWorking']

    const colour = d3
        .scaleOrdinal()
        .domain(keys)
        .range([colours.outOfWorkforce, colours.working, colours.notWorking])

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
        .attr('fill', d => colour(d.key))
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

    const getTooltipDataPoint = (event) => {
        const x_val = x.invert(d3.pointer(event)[0])
        const idx = d3.bisector(d => d.measureDate).center(data, x_val)
        const x_real_val = data[idx].measureDate
        const key = x_real_val.getTime()

        return [tooltipData[key], key]
    }


    const tooltips = chart
        .append('g')
        .attr('class', 'tooltips')

    const { mouseover, mousemove, mouseleave } = addTooltip('charts', d => formatDate(d.x))

    const clearTooltips = () => {
        tooltips
            .selectAll('line')
            .attr('stroke', 'transparent')
        tooltips
            .selectAll('circle')
            .attr('fill', 'transparent')
    }
    const fillTooltips = key => {
        tooltips
            .selectAll(`.tooltip-line-${key}`)
            .attr('stroke', '#a21caf')
        tooltips
            .selectAll(`.tooltip-circle-${key}`)
            .attr('fill', '#a21caf')
    }

    const customMouseOver = function (event, d) {
        mouseover(event, "")
    }
    const customMouseMove = function (event, d) {
        const [tooltipData, key] = getTooltipDataPoint(event)
        clearTooltips()
        fillTooltips(key)
        mousemove(event, tooltipData)
    }
    const customMouseLeave = function (event, d) {
        clearTooltips()
        mouseleave(event, d)
    }

    for (let tooltip of Object.entries(tooltipData)) {
        tooltips
            .append('line')
            .attr('class', `tooltip-line-${tooltip[0]}`)
            .attr('x1', x(tooltip[1].x))
            .attr('x2', x(tooltip[1].x))
            .attr('y1', 0)
            .attr('y2', height)
            .attr('stroke', 'transparent')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', 7)

        for (let yPosition of tooltip[1]['ys']) {
            tooltips
                .append('circle')
                .attr('class', `tooltip-circle-${tooltip[0]}`)
                .attr('cx', x(tooltip[1].x))
                .attr('cy', y(yPosition))
                .attr('r', 3)
                .attr('fill', 'transparent')
        }
    }

    tooltips
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width)
        .attr('fill', 'transparent')
        .on('mouseover', customMouseOver)
        .on('mousemove', customMouseMove)
        .on('mouseleave', customMouseLeave)


    addLegend({
        chart,
        legends: ['Out of Workforce', 'Working', 'Not Working'],
        colours: [colours.outOfWorkforce, colours.working, colours.notWorking],
        xPos: -64,
        yPos: -32
    })
}