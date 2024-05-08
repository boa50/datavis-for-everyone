import { colours } from "../../constants.js"
import { addAxis } from "../../../components/axis/script.js"
import { addLegend } from "../../../components/colour-legend/script.js"
import { addHighlightTooltip as addTooltip } from "../../../components/tooltip/script.js"

const getData = () =>
    d3.csv('../data/greenhouse-emissions-food.csv')

export const addChart = chartProps => {
    const { chart, width, height, margin } = chartProps

    getData().then(data => {
        const dataFiltered = data
            .sort((a, b) => b.emissionsPerKg - a.emissionsPerKg)
            .filter((d, i) => i <= 14)

        const x = d3
            .scaleLinear()
            .domain([0, d3.max(dataFiltered, d => d.emissionsPerKg) * 1.05])
            .range([0, width])

        const y = d3
            .scaleBand()
            .domain(dataFiltered.map(d => d.food))
            .range([0, height])
            .padding(.1)

        const colour = d3
            .scaleSequential()
            .domain([0, d3.max(dataFiltered, d => d.emissionsPerKg)])
            .range([`${colours.default}30`, colours.default])

        const chartRects = chart
            .selectAll('.food-rect')
            .data(dataFiltered)
            .join('rect')
            .attr('x', x(0))
            .attr('y', d => y(d.food))
            .attr('width', d => x(d.emissionsPerKg))
            .attr('height', y.bandwidth())
            .attr('fill', d => colour(d.emissionsPerKg))

        addAxis({
            chart,
            height,
            width,
            x,
            y,
            xLabel: 'Greenhouse gas emissions (Kg of CO₂)',
            yLabel: 'Food',
            xNumTicks: 5,
            xNumTicksForceInitial: true,
            colour: colours.axis
        })

        chart
            .append('g')
            .attr('id', 'colour-legend')

        const colourLegendWidth = 128

        const colourLegendAxis = d3
            .scaleLinear()
            .domain(colour.domain())
            .range([0, colourLegendWidth])

        addLegend({
            id: 'colour-legend',
            title: 'Emissions (Kg of CO₂)',
            colourScale: colour,
            axis: colourLegendAxis,
            width: colourLegendWidth,
            xPos: width - margin.right / 2 - colourLegendWidth,
            yPos: height - margin.bottom / 1.25,
            textColour: colours.axis
        })

        addTooltip(
            `${chart.attr('id').split('-')[0]}-container`,
            d => `
            <strong>${d.food}</strong>   
            <div style="display: flex; justify-content: space-between">
                <span>Emissions:&emsp;</span>
                <span>${d3.format('.2f')(d.emissionsPerKg)} (Kg of CO₂)</span>
            </div>
            `,
            chartRects,
            {
                initial: 1,
                highlighted: 1,
                faded: 0.25
            },
            { width, height }
        )
    })

}