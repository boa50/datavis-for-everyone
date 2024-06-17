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

const weights = {
    'Academic Reputation': 0.3,
    'Employer Reputation': 0.15,
    'Faculty Student': 0.1,
    'Citations per Faculty': 0.2,
    'International Faculty': 0.05,
    'International Students': 0.05,
    'International Research Network': 0.05,
    'Employment Outcomes': 0.05,
    'Sustainability': 0.05
}

const recalculateOverall = d =>
    (d['Academic Reputation'] * weights['Academic Reputation'] +
        d['Employer Reputation'] * weights['Employer Reputation'] +
        d['Faculty Student'] * weights['Faculty Student'] +
        d['Citations per Faculty'] * weights['Citations per Faculty'] +
        d['International Faculty'] * weights['International Faculty'] +
        d['International Students'] * weights['International Students'] +
        d['International Research Network'] * weights['International Research Network'] +
        d['Employment Outcomes'] * weights['Employment Outcomes'] +
        d['Sustainability'] * weights['Sustainability'])
    / Object.values(weights).reduce((total, current) => total + current)

const academicReputation = document.getElementById('academicReputation')

getData().then(data => {
    academicReputation.value = 57

    const dataRecalculated = data.map(d => {
        return {
            ...d,
            'Overall Recalculated': recalculateOverall(d)
        }
    })

    addChart(
        getChart({
            id: 'chart1',
            margin: getMargin({ left: 376, bottom: 64 })

        }),
        data
    )
})