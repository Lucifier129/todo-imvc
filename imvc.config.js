let isProd = process.env.NODE_ENV === 'production'
let alias =  isProd ? {
    'react': 'react-lite',
    'react-dom': 'react-lite',
    // 'react': 'preact-compat',
    // 'react-dom': 'preact-compat',
    // 'react': 'inferno-compat',
    // 'react-dom': 'inferno-compat',
    // 'react': 'anujs',
    // 'react-dom': 'anujs',
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