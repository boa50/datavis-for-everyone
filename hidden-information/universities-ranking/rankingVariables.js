import { addTooltip } from '../../node_modules/visual-components/index.js'
import { toCamelCase } from "./utils.js"

export const variables = [
    'Academic Reputation',
    'Employer Reputation',
    'Faculty Student',
    'Citations per Faculty',
    'International Faculty',
    'International Students',
    'International Research Network',
    'Employment Outcomes',
    'Sustainability'
]

export const weights = {
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

export const setUpControls = () => {
    // Adding controls
    variables.forEach(v => { addControl(v) })

    // Getting controls objects
    const controls = {}
    variables.forEach(v => { controls[v] = document.getElementById(toCamelCase(v)) })

    // Setting initial values
    variables.forEach(v => { controls[v].value = weights[v] * 100 })

    // Adding informational tooltips
    const { mouseover, mouseleave } = addTooltip('weights', d => d)

    variables.forEach(v => {
        const element = document.getElementById(toCamelCase(v) + 'Info')

        element.addEventListener('mouseover', event => {
            mouseover(event, `Explanation about ${v}`)
        })

        element.addEventListener('mouseleave', event => { mouseleave(event) })
    })

    return controls
}


function getVariableGroup(variable) {
    if (['Academic Reputation', 'Citations per Faculty', 'International Research Network'].includes(variable)) {
        return 'research'
    } else if (['Employer Reputation', 'Employment Outcomes'].includes(variable)) {
        return 'employability'
    } else if (['International Faculty', 'International Students'].includes(variable)) {
        return 'diversity'
    } else {
        return 'other'
    }
}

function addControl(variable) {
    const group = getVariableGroup(variable)

    d3.select(`#${group}Group`)
        .append('div')
        .attr('class', 'mx-12 flex justify-between')
        .call(d => {
            d
                .append('div')
                .attr('class', 'flex')
                .call(di => {
                    di
                        .append('label')
                        .attr('for', toCamelCase(variable))
                        .attr('class', 'text-base text-gray-700 font-normal')
                        .text(variable)
                })
                .call(di => {
                    di
                        .append('img')
                        .attr('id', `${toCamelCase(variable)}Info`)
                        .attr('class', 'h-4 ml-px')
                        .attr('src', './img/info.svg')
                        .attr('alt', 'More information')
                })
        })
        .call(d => {
            d
                .append('div')
                .attr('class', 'ml-4 text-gray-600')
                .call(di => {
                    di
                        .append('input')
                        .attr('id', toCamelCase(variable))
                        .attr('name', toCamelCase(variable))
                        .attr('class', 'bg-neutral-50 w-8 text-end')
                        .attr('type', 'number')
                        .attr('min', 0)
                        .attr('max', 100)
                        .attr('step', 5)
                })
                .call(di => {
                    di
                        .append('span')
                        .text('%')
                })
        })
}