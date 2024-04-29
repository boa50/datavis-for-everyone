import { colours } from "../constants.js"
import { addAxis } from "../../components/axis/script.js"
import { addLegendV2 as addLegend } from "../../components/legend/script.js"
import { formatCurrency } from "../../components/utils.js"

const drawChart = ({
    data,
    chart,
    lineLifeSatisfaction,
    lineGdp,
    countries
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

    addLegend({
        chart: chart,
        legends: ['Life satisfaction', 'GDP per capita'],
        colours: [colourLifeSatisfaction(countries[0]), colourGdp(countries[0])],
        xPos: -64,
        yPos: -32
    })
}


export const updateChart = ({
    data,
    chart,
    lineLifeSatisfaction,
    lineGdp,
    countries
}) => {
    const legendId = chart.attr('id') + '-legend'
    chart.select(`#${legendId}`).remove()

    drawChart({
        data,
        chart,
        lineLifeSatisfaction,
        lineGdp,
        countries
    })
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

    const chartObject = {
        data,
        chart,
        lineLifeSatisfaction,
        lineGdp,
        countries
    }

    drawChart(chartObject)

    return chartObject


    // addLineTooltip(
    //     'charts',
    //     d => `
    //     <div style="display: flex; justify-content: space-between">
    //         <span>Year:&emsp;</span>
    //         <span>${d.year}</span>
    //     </div>
    //     <div style="display: flex; justify-content: space-between">
    //         <span>Degrees Awarded:&emsp;</span>
    //         <span>${d.awards}</span>
    //     </div>
    //     `,
    //     colours.line1,
    //     {
    //         chart: chart,
    //         data: data,
    //         cx: d => x(d.year),
    //         cy: d => yLeft(d.awards),
    //         radius: 5
    //     }
    // )

    // addLineTooltip(
    //     'charts',
    //     d => `
    //     <div style="display: flex; justify-content: space-between">
    //         <span>Year:&emsp;</span>
    //         <span>${d.year}</span>
    //     </div>
    //     <div style="display: flex; justify-content: space-between">
    //         <span>Search Volume:&emsp;</span>
    //         <span>${d3.format('.1f')(d.searches)}</span>
    //     </div>
    //     `,
    //     colours.line2,
    //     {
    //         chart: chart,
    //         data: data,
    //         cx: d => x(d.year),
    //         cy: d => yRight(d.searches),
    //         radius: 5
    //     }
    // )
}