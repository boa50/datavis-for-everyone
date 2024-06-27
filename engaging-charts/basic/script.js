import { getChart } from "../../node_modules/visual-components/index.js";
import { addChart as addExpectancyByGender } from "./charts/bar-expectancy-by-gender.js";
import { addChart as addExpectancyGap } from "./charts/line-life-expectancy-gap.js";
import { addChart as addExpectancyScatter } from "./charts/scatter-expectancy-distribution.js";
import { addChart as addGreenhouseBySector } from "./charts/area-greenhouse-emissions-sector.js";
import { addChart as addGreenhousePerFood } from "./charts/bar-food-emissions.js";

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
                left: 140,
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
                left: 64,
                right: 16,
                top: 24,
                bottom: 56
            },
            chartDimensions: {}
        }),
        data
    )

    addExpectancyScatter(
        getChart({
            id: 'chart3',
            chartDimensions: {}
        }),
        data
    )

    addGreenhouseBySector(
        getChart({
            id: 'chart4',
            margin: {
                left: 96,
                right: 16,
                top: 24,
                bottom: 56
            },
            chartDimensions: {}
        })
    )

    addGreenhousePerFood(
        getChart({
            id: 'chart5',
            margin: {
                left: 138,
                right: 16,
                top: 8,
                bottom: 56
            },
            chartDimensions: {}
        })
    )
})