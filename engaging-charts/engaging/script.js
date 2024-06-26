import { getChart } from "../../node_modules/visual-components/index.js";
import { addChart as addExpectancyByGender } from "./charts/lollipop-expectancy-by-gender.js";
import { addChart as addExpectancyGap } from "./charts/ridgeline-life-expectancy-gap.js";
import { addChart as addExpectancyDistribution } from "./charts/hexbin-expectancy-distribution.js";
import { addChart as addGreenhouseEmissions } from "./charts/circular-bar-greenhouse-emissions.js";
import { addChart as addFoodEmissions } from "./charts/word-cloud-food-emissions.js";

const getData = () =>
    d3.csv('../data/life-expectancy.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                female: +v.female,
                male: +v.male,
                average: (+v.female + +v.male) / 2,
                gap: Math.abs(+v.female - +v.male)
            }
        }))

getData().then(data => {
    addExpectancyByGender(
        getChart({
            id: 'chart1',
            margin: {
                left: 16,
                right: 16,
                top: 24,
                bottom: 56
            },
            chartDimensions: {}
        }),
        data.filter(d => d.year === '2021')
    )

    addExpectancyGap(
        getChart({
            id: 'chart2',
            margin: {
                left: 120,
                right: 16,
                top: 64,
                bottom: 56
            },
            chartDimensions: {}
        }),
        data
    )

    addExpectancyDistribution(
        getChart({
            id: 'chart3',
            chartDimensions: {}
        }),
        data
    )

    addGreenhouseEmissions(
        getChart({
            id: 'chart4',
            margin: {
                left: 16,
                right: 16,
                top: 16,
                bottom: 8
            },
            chartDimensions: {}
        })
    )

    addFoodEmissions(
        getChart({
            id: 'chart5',
            margin: {
                left: 0,
                right: 0,
                top: 8,
                bottom: 8
            },
            chartDimensions: {}
        })
    )
})