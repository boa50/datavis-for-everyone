// Function to convert into camel Case; based on: https://www.geeksforgeeks.org/how-to-convert-string-to-camel-case-in-javascript/
export const toCamelCase = str => {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}