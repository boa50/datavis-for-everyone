import { getChart } from "../../components/utils.js";
import { addChart as addExpectancyByGender } from "./charts/lollipop-expectancy-by-gender.js";

const getData = () =>
    d3.csv('../data/life-expectancy.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                female: +v.female,
                male: +v.male,
                average: (+v.female + +v.male) / 2
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
})