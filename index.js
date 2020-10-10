const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
// const yup = require('yup');
const monk = require('monk');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { nanoid } = require('nanoid');

require('dotenv').config();

const db = monk(process.env.MONGODB_URI); // Establish DB connection
const reports = db.get('reports');

const app = express();
app.enable('trust proxy');

app.use(helmet());
app.use(morgan('common'));
app.use(express.json({limit: '10mb'})); // Set limit for size of request
app.use(express.static('./public')); // Serve ./public static folder

// const schema = yup.object().shape({
//   slug: yup.string().trim().matches(/^[\w\-]+$/i),
//   url: yup.string().trim().url().required(),
// });

// Retrieving scripts for different tags
app.get('/t/:tag', async (req, res, next) => {
  const { tag } = req.params;
  try {
    res.json("ELIFJ" + tag)
  } catch (error) {
  }
});

// Creating a report
app.post('/api/v1/report', async (req, res, next) => {
  try {
    let { report } = req.body;
    await reports.insert(report);
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "failure", error: error });
  }
});

// Deleting all reports
app.delete('/api/v1/report/all', async (req, res, next) => {
  try {
    await reports.remove({})
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "failure", error: error });
  }
});

// Retrieving all reports
app.get('/api/v1/report/all', async (req, res, next) => {
  try {
    let allReports = await reports.find({});
    res.json({ status: "success", numReports: allReports.length, reports: allReports });
  } catch (error) {
    res.json({ status: "failure", error: error });
  }
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
