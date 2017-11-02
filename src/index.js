export default [
    {
        path: ['/todos/:type', '*'],
        controller: require('./todos/Controller')
    }
]