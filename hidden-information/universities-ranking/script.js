import { getChart } from "../../node_modules/visual-components/index.js"

const getData = () =>
    d3.csv('./data/universities-ranking-2025.csv')


getData().then(data => {

})