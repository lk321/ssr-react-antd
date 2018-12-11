import fs from 'fs';
import path from 'path';
import React from 'react';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import serialize from 'serialize-javascript';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';

import Routes from './src/routes';

import App from './src/App';

const app = express();

var cfg = JSON.parse(fs.readFileSync('config.json', 'utf8'));
global.ConfigApp = cfg[cfg.env];

if (ConfigApp.logger) app.use(require('morgan')('dev'));

app.use(express.static('./build'));

app.use(compression());
app.use(bodyParser.json({ limit: '50mb', type: '*/*' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.get('/pricing', function (req, res) {
    res.json({ message: 'TEST!!!' })
});

app.get('/*', (req, res) => {
    const currentRoute =
        Routes.find(route => matchPath(req.url, route)) || {};
    let promise;

    if (currentRoute.loadData) {
        promise = currentRoute.loadData();
    } else {
        promise = Promise.resolve(null);
    }

    promise.then(data => {
        const context = { data };

        const app = ReactDOMServer.renderToString(
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        );

        const indexFile = path.resolve('./build/index.html');
        fs.readFile(indexFile, 'utf8', (err, indexData) => {
            if (err) {
                console.error('Something went wrong:', err);
                return res.status(500).send('Oops, better luck next time!');
            }

            if (context.status === 404) {
                res.status(404);
            }

            if (context.url) {
                return res.redirect(301, context.url);
            }

            return res.send(
                indexData
                    .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
                    .replace(
                        '</body>',
                        `<script>window.__ROUTE_DATA__ = ${serialize(data)}</script></body>`
                    )
            );
        });
    });
});
 
app.listen(ConfigApp.port, function () {
    console.log(`😎  Server is listening on port ${ConfigApp.port} !`);
})  