let isProd = process.env.NODE_ENV === 'production'
let alias =  isProd ? {
    'react': 'react-lite',
    'react-dom': 'react-lite',
} : {}
let renderMode = isProd ? 'renderToStaticMarkup' : 'renderToString'
let entry = {
    vendor: ['socket.io-client']
}

export default {
    routes: 'routes',
    entry,
    alias,
    renderMode,
    // appSettings: {
    //     forceRefresh: true
    // }
}