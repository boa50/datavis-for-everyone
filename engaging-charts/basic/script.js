import { getChart } from "../../components/utils.js";
import { addChart as addExpectancyByGender } from "./charts/bar-expectancy-by-gender.js";
import { addChart as addExpectancyGap } from "./charts/line-life-expectancy-gap.js";
import { addChart as addExpectancyScatter } from "./charts/scatter-expectancy-distribution.js";
import { addChart as addGreenhouseBySector } from "./charts/area-greenhouse-emissions-sector.js";

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
        getChart(
            'chart1',
            document.getElementById('chart1-container').offsetWidth,
            svgHeight,
            {
                left: 140,
                right: 16,
                top: 24,
                bottom: 56
            }
        ),
        data.filter(d => d.year === '2021')
    )

    addExpectancyGap(
        getChart(
            'chart2',
            document.getElementById('chart2-container').offsetWidth,
            svgHeight,
            {
                left: 64,
                right: 16,
                top: 24,
                bottom: 56
            }
        ),
        data
    )

    addExpectancyScatter(
        getChart(
            'chart3',
            document.getElementById('chart3-container').offsetWidth,
            svgHeight,
            {
                left: 64,
                right: 16,
                top: 24,
                bottom: 56
            }
        ),
        data
    )

    addGreenhouseBySector(
        getChart(
            'chart4',
            document.getElementById('chart4-container').offsetWidth,
            svgHeight,
            {
                left: 200,
                right: 16,
                top: 24,
                bottom: 56
            }
        )
    )
})