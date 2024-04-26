import { colours } from "../constants.js"
import { addAxis } from "../../components/axis/script.js"
import { addLegendV2 as addLegend } from "../../components/legend/script.js"
import { formatCurrency } from "../../components/utils.js"

const getData = () =>
    d3.csv('./data/gdp-vs-happiness-cleansed.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                gdpPerCapita: +v.gdpPerCapita,
                lifeSatisfaction: +v.lifeSatisfaction
            }
        }))

export const plotChart = (chartProps, countries, countriesSelector) => {
    const { chart, width, height, margin } = chartProps

    getData().then(data => {
        const allCountries = [...new Set(data.map(d => d.country))].sort()
        countriesSelector.innerHTML = allCountries
            .map(country => `<option value="${country}" ${countries.includes(country) ? 'selected' : null}>${country}</option>`)
        countriesSelector.loadOptions()

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

        const dataFiltered = data.filter(d => countries.includes(d.country))
        const dataGrouped = d3.group(dataFiltered, d => d.country)
        const colourLifeSatisfaction = d3
            .scaleOrdinal()
            .range(d3.schemeCategory10)
        const colourGdp = d3
            .scaleOrdinal()
            .range(d3.schemeCategory10.map(d => d + '75'))

        const strokeWidth = 3
        chart
            .selectAll('.drewLine')
            .data(dataGrouped)
            .join('path')
            .attr('fill', 'none')
            .attr('stroke', d => colourLifeSatisfaction(d[0]))
            .attr('stroke-width', strokeWidth)
            .attr('d', d => lineLifeSatisfaction(d[1]))

        chart
            .selectAll('.drewLine')
            .data(dataGrouped)
            .join('path')
            .attr('fill', 'none')
            .attr('stroke', d => colourGdp(d[0]))
            .attr('stroke-width', strokeWidth)
            .attr('d', d => lineGdp(d[1]))


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

        addLegend({
            chart: chart,
            legends: ['Life satisfaction', 'GDP per capita'],
            colours: [colourLifeSatisfaction(countries[0]), colourGdp(countries[0])],
            xPos: -64,
            yPos: -32
        })

    })
}