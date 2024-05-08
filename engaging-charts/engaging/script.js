import { getChart } from "../../components/utils.js";
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
                left: 110,
                right: 16,
                top: 64,
                bottom: 56
            }
        ),
        data
    )

    addExpectancyDistribution(
        getChart(
            'chart3',
            document.getElementById('chart3-container').offsetWidth,
            svgHeight
        ),
        data
    )

    addGreenhouseEmissions(
        getChart(
            'chart4',
            document.getElementById('chart4-container').offsetWidth,
            svgHeight,
            {
                left: 16,
                right: 16,
                top: 16,
                bottom: 8
            }
        )
    )

    addFoodEmissions(
        getChart(
            'chart5',
            document.getElementById('chart5-container').offsetWidth,
            svgHeight,
            {
                left: 0,
                right: 0,
                top: 8,
                bottom: 8
            }
        )
    )
})