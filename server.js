const express = require('express');
const mongoose = require('mongoose');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const Project = require('./models/project.js');

const app = express();
const compiler = webpack(config);
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.use(express.static(`${__dirname}/public`));

app.get('/api', (req, res) => {
  Project.find({}, 'title description icon frameworks').sort({order: 'asc'}).then(data => {
    res.json(data);
  }).catch( error => {
    res.json({ error });
  });
});

app.use((req, res) => {
  res.sendFile(`${__dirname}/views/404.html`, 404);
});

app.listen(port, console.log(`Server is listening at port ${port}.`));
