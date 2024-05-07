import { colours } from "../../constants.js"
import { addAxis } from "../../../components/axis/script.js"
import { addLegendV2 as addLegend } from "../../../components/legend/script.js"
import { addVerticalTooltip as addTooltip } from "../../../components/tooltip/script.js"

const getData = () =>
    d3.csv('../data/greenhouse-emissions.csv')

export const addChart = chartProps => {
    const { chart, width, height, margin } = chartProps

    getData().then(data => {
        const x = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([0, width])

        const keys = ['electricityAndHeat', 'transport', 'manufacturingAndConstruction', 'agriculture', 'buildings', 'industry']

        const colour = d3
            .scaleOrdinal()
            .domain(keys)
            .range(d3.schemeTableau10)

        const stackedData = d3
            .stack()
            .keys(keys)
            (data)

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1]) * 1.1])
            .range([height, 0])

        const area = d3
            .area()
            .x(d => x(d.data.year))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))

        chart
            .selectAll('.stacks')
            .data(stackedData)
            .join('path')
            .attr('fill', d => colour(d.key))
            .attr('d', area)

        addAxis({
            chart,
            height,
            width,
            x,
            y,
            xLabel: 'Year',
            yLabel: 'Greenhouse emissions (in tonnes)',
            xFormat: d => d,
            yFormat: d => `${d3.format('.2s')(d).replace('G', ' billion').replace('.0', '')}`,
            xNumTicks: 5,
            yNumTicks: 6,
            yNumTicksForceInitial: true,
            colour: colours.axis
        })

        addLegend({
            chart,
            legends: ['Electricity and Heat', 'Transport', 'Manufacturing and Construction', 'Agriculture', 'Buildings', 'Industry'],
            colours: d3.schemeTableau10,
            xPos: -margin.left,
            yPos: -margin.top
        })

        const tooltipData = {}

        for (let i = 0; i < stackedData[0].length; i++) {
            tooltipData[data[i].year] = {
                x: data[i].year,
                ys: stackedData.map(stack => stack[i][1]),
                electricityAndHeat: data[i].electricityAndHeat,
                transport: data[i].transport,
                manufacturingAndConstruction: data[i].manufacturingAndConstruction,
                agriculture: data[i].agriculture,
                buildings: data[i].buildings,
                industry: data[i].industry,
            }
        }

        const tooltipFormat = d => `${d3
            .formatLocale({ thousands: ' ', grouping: [3] })
            .format(',.0f')
            (Math.round(d / 1e6))
            } million`

        addTooltip({
            id: `${chart.attr('id').split('-')[0]}-container`,
            htmlText: d => `
            <strong>${d.x}</strong> <span>(in tonnes)</span>
            <div style="display: flex; justify-content: space-between">
                <strong>Total:&emsp;</strong>
                <span>${tooltipFormat(keys.reduce((total, key) => total + +d[key], 0))}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>Industry:&emsp;</span>
                <span>${tooltipFormat(d.industry)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
            <span>Buildings:&emsp;</span>
                <span>${tooltipFormat(d.buildings)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>Agriculture:&emsp;</span>
                <span>${tooltipFormat(d.agriculture)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>Manufacturing and Construction:&emsp;</span>
                <span>${tooltipFormat(d.manufacturingAndConstruction)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>Transport:&emsp;</span>
                <span>${tooltipFormat(d.transport)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>Electricity and Heat:&emsp;</span>
                <span>${tooltipFormat(d.electricityAndHeat)}</span>
            </div>
            `,
            chart,
            width,
            height,
            x,
            y,
            colour: colours.lineTooltip,
            data,
            xVariable: 'year',
            tooltipData
        })
    })

}