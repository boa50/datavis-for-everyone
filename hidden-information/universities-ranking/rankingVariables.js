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

const variablesInformation = {
    'Academic Reputation': `
    <div class="max-w-[25vw]">
        <p>The main focus is on academic research</p>
        <p>Has the objective to answer which universities are demonstrating academic excellence</p>
        <p>Its score is based on the results of a survey sent to a diversity of academics</p>
    </div>
    `,
    'Employer Reputation': `
    <div class="max-w-[25vw]">
        <p>Its score is based on the results of a survey sent to a diversity of employers</p>
        <p>The main question asks which universities are producing the best employees</p>
    </div>
    `,
    'Faculty Student': `
    <div class="max-w-[25vw]">
        <p>Its score is obtained by dividing the number of full-time students by the number of full-time faculty</p>
        <p>It doesn't make distinctions between type of student (undergraduate, postgraduate) and kind of faculty 
        (professor, researcher) because it is hard to find a dataset with this level of granularity for many countries</p>
    </div>
    `,
    'Citations per Faculty': `
    <div class="max-w-[25vw]">
        <p>Its score is based on how much and how well the institution's articles are cited by other papers</p>
        <p>Take into consideration the volume of research and the size of the institution</p>
    </div>
    `,
    'International Faculty': `
    <div class="max-w-[25vw]">
        <p>The main focus is on the diversity of faculty</p>
        <p>Its score considers the number of faculty staff who contribute to academic teaching or research or 
        both at a university for a minimum period of at least three months and who are of foreign nationality 
        as a proportion of overall faculty staff</p>
    </div>
    `,
    'International Students': `
    <div class="max-w-[25vw]">
        <p>The main focus is on the diversity of students</p>
        <p>Its score considers the total number of undergraduate and postgraduate students who are foreign nationals 
        and spend at least three months at your university as a proportion of the total number of undergraduate and 
        postgraduate students overall</p>
    </div>
    `,
    'International Research Network': `
    <div class="max-w-[25vw]">
        <p>The main focus is on how institutions create and sustain research partnerships</p>
    </div>
    `,
    'Employment Outcomes': `
    <div class="max-w-[25vw]">
        <p>The main focus is on employability</p>
        <p>Its score considers how many graduates were employed and how many became leaders in some organisations 
        or received meaningful awards</p>
    </div>
    `,
    'Sustainability': `
    <div class="max-w-[25vw]">
        <p>The main focus is on research aligned with the United Nations' Sustainable Development Goals (SDG)</p>
        <p>Institutions must also have plans on how they'll mitigate the impact of their operations on the climate and the environment</p>
    </div>
    `
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
    const { mouseover, mouseleave } = addTooltip('weights', d => d, { chartWidth: 500, chartHeight: -1 })

    variables.forEach(v => {
        const element = document.getElementById(toCamelCase(v) + 'Info')

        element.addEventListener('mouseover', event => {
            console.log(d3.pointer(event));
            mouseover(event, variablesInformation[v])
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