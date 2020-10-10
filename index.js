const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { nanoid } = require('nanoid');

require('dotenv').config();

const app = express();
app.enable('trust proxy');

app.use(helmet());
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('./public'));

const schema = yup.object().shape({
  slug: yup.string().trim().matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
});

app.get('/t/:tag', async (req, res, next) => {
  const { tag } = req.params;
  try {
    res.json("ELIFJ" + tag)
    // const url = await urls.findOne({ slug });
    // if (url) {
    //   return res.redirect(url.url);
    // }
    // return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    // return res.status(404).sendFile(notFoundPath);
  }
});

app.get('/asdf', async (req, res, next) => {
  res.json("hello world! testing!!!");
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
