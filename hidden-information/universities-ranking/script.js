import { getChart, getMargin } from '../../node_modules/visual-components/index.js'
import { addChart } from './bar.js'

const getData = () =>
    d3.csv('./data/universities-ranking-2025.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                'Academic Reputation': +v['Academic Reputation'].replace(',', '.'),
                'Employer Reputation': +v['Employer Reputation'].replace(',', '.'),
                'Faculty Student': +v['Faculty Student'].replace(',', '.'),
                'Citations per Faculty': +v['Citations per Faculty'].replace(',', '.'),
                'International Faculty': +v['International Faculty'].replace(',', '.'),
                'International Students': +v['International Students'].replace(',', '.'),
                'International Research Network': +v['International Research Network'].replace(',', '.'),
                'Employment Outcomes': +v['Employment Outcomes'].replace(',', '.'),
                'Sustainability': +v['Sustainability'].replace(',', '.'),
                'Overall': +v['Overall'].replace(',', '.')
            }
        }))


getData().then(data => {
    addChart(
        getChart({
            id: 'chart1',
            margin: getMargin({ left: 376, bottom: 64 })

        }),
        data
    )
})