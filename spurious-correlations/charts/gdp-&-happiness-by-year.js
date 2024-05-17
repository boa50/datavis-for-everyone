import { colours } from "../constants.js"
import { addAxis } from "../../components/axis/script.js"
import { addLegend } from "../../components/legend/script.js"
import { formatCurrency } from "../../components/utils.js"
import { addLineTooltip } from "../../components/tooltip/script.js"

export const updateChart = ({
    data,
    chart,
    lineLifeSatisfaction,
    lineGdp,
    x,
    yLeft,
    yRight,
    countries,
    mouseover,
    mousemove,
    mouseleave
}) => {
    const dataFiltered = data.filter(d => countries.includes(d.country))
    const dataGrouped = d3.group(dataFiltered, d => d.country)
    const colourLifeSatisfaction = d3
        .scaleOrdinal()
        .domain(countries)
        .range(d3.schemeCategory10)
    const colourGdp = d3
        .scaleOrdinal()
        .domain(countries)
        .range(d3.schemeCategory10.map(d => d + '75'))

    const strokeWidth = 3
    chart
        .selectAll('.lifeSatisfactionLine')
        .data(dataGrouped)
        .join('path')
        .attr('class', 'lifeSatisfactionLine')
        .attr('fill', 'none')
        .attr('stroke', d => colourLifeSatisfaction(d[0]))
        .attr('stroke-width', strokeWidth)
        .attr('d', d => lineLifeSatisfaction(d[1]))

    chart
        .selectAll('.gdpLine')
        .data(dataGrouped)
        .join('path')
        .attr('class', 'gdpLine')
        .attr('fill', 'none')
        .attr('stroke', d => colourGdp(d[0]))
        .attr('stroke-width', strokeWidth)
        .attr('d', d => lineGdp(d[1]))


    if (chart.select(`#${chart.attr('id') + '-legend'}`).empty()) {
        addLegend({
            chart: chart,
            legends: ['Life satisfaction', 'GDP per capita'],
            colours: [colourLifeSatisfaction(countries[0]), colourGdp(countries[0])],
            xPosition: -64,
            yPosition: -36
        })
    }

    const legendId = chart.attr('id') + '-legend-countries'
    chart.select(`#${legendId}`).remove()

    addLegend({
        chart,
        customId: legendId,
        legends: countries,
        colours: countries.map(country => colourLifeSatisfaction(country)),
        xPosition: -64,
        yPosition: -14
    })

    const drawTooltipDots = (dotsClass, cy) => {
        chart
            .select('.tooltipDots')
            .selectAll(`.${dotsClass}`)
            .data(dataFiltered)
            .join('circle')
            .attr('class', dotsClass)
            .attr('cx', d => x(d.year))
            .attr('cy', cy)
            .attr('r', 4)
            .attr('stroke', 'transparent')
            .attr('stroke-width', 12)
            .attr('fill', 'transparent')
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)
    }

    drawTooltipDots('dotLifeSatisfaction', d => yLeft(d.lifeSatisfaction))
    drawTooltipDots('dotGdpPerCapita', d => yRight(d.gdpPerCapita))
}

export const plotChart = (data, chartProps, countries) => {
    const { chart, width, height } = chartProps

    const gdpAxisTicks = [1, 2, 5, 15, 30, 60, 120].map(d => d * 1e3)

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const yLeft = d3
        .scaleLinear()
        .domain([0, 10])
        .range([height - 8, 0])

    const yRight = d3
        .scaleLog()
        .domain(d3.extent(data, d => d.gdpPerCapita))
        .range([height - 8, 0])

    const lineLifeSatisfaction = d3
        .line()
        .x(d => x(d.year))
        .y(d => yLeft(d.lifeSatisfaction))

    const lineGdp = d3
        .line()
        .x(d => x(d.year))
        .y(d => yRight(d.gdpPerCapita))

    addAxis({
        chart: chart,
        height: height,
        width: width,
        x: x,
        y: yLeft,
        yRight: yRight,
        xLabel: 'Year',
        yLabel: 'Life satisfaction (0 - 10)',
        yRightLabel: 'GDP per Capita',
        xFormat: d3.format(''),
        yFormat: d3.format('.1s'),
        yRightFormat: d => `${formatCurrency(d / 1000)}k`,
        colour: colours.axis,
        hideYdomain: true,
        yRightTickValues: gdpAxisTicks
    })

    chart
        .append('g')
        .attr('class', 'tooltipDots')

    const { mouseover, mousemove, mouseleave } = addLineTooltip({
        id: 'charts',
        htmlText: d => `
            <strong>${d.country}</strong>
            <div style="display: flex; justify-content: space-between">
                <span>Year:&emsp;</span>
                <span>${d.year}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>Life Satisfaction:&emsp;</span>
                <span>${d3.format('.2f')(d.lifeSatisfaction)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>GDP per Capita:&emsp;</span>
                <span>${formatCurrency(d.gdpPerCapita)}k</span>
            </div>
            `,
        colour: colours.tootipDotBright
    })

    const chartObject = {
        data,
        chart,
        lineLifeSatisfaction,
        lineGdp,
        x,
        yLeft,
        yRight,
        countries,
        mouseover,
        mousemove,
        mouseleave
    }

    updateChart(chartObject)

    return chartObject
}