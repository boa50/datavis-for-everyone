import { getChart } from "../../components/utils.js";
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

const svgHeight = (window.innerHeight
    - document.getElementById('header').offsetHeight
    - document.getElementById('caption').offsetHeight) / 2
    - 64

getData().then(data => {
    addExpectancyByGender(
        getChart({
            id: 'chart1',
            svgHeight,
            margin: {
                left: 140,
                right: 16,
                top: 24,
                bottom: 56
            }
        }),
        data.filter(d => d.year === '2021')
    )

    addExpectancyGap(
        getChart({
            id: 'chart2',
            svgHeight,
            margin: {
                left: 64,
                right: 16,
                top: 24,
                bottom: 56
            }
        }),
        data
    )

    addExpectancyScatter(
        getChart({
            id: 'chart3',
            svgHeight
        }),
        data
    )

    addGreenhouseBySector(
        getChart({
            id: 'chart4',
            svgHeight,
            margin: {
                left: 96,
                right: 16,
                top: 24,
                bottom: 56
            }
        })
    )

    addGreenhousePerFood(
        getChart({
            id: 'chart5',
            svgHeight,
            margin: {
                left: 132,
                right: 16,
                top: 8,
                bottom: 56
            }
        })
    )
})