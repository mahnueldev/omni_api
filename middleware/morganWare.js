const fs = require('fs-extra');
const path = require('path');
const morgan = require('morgan');
const { createStream } = require('rotating-file-stream');
const { format } = require('date-fns-tz');

const logDirectory = path.join(__dirname, '..', 'log');

// Create log directory if it does not exist
fs.ensureDirSync(logDirectory);

const accessLogStream = createStream('access.log', {
  interval: '1d',
  path: logDirectory,
  compress: 'gzip',
});

const errorLogStream = createStream('error.log', {
  interval: '1d',
  path: logDirectory,
  compress: 'gzip',
});

const timeZone = 'Africa/Lagos'; // change to your timezone

// Define a custom logging format
const formatLogMessage = (tokens, req, res) => {
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss zzz', { timeZone });
  return `[${date}] ${tokens.method(req, res)} ${tokens.url(
    req,
    res
  )} ${tokens.status(req, res)} ${tokens.res(
    req,
    res,
    'content-length'
  )} - ${tokens['response-time'](req, res)} ms`;
};

// Create middleware for access logging
const accessLogMiddleware = morgan(formatLogMessage, {
  stream: accessLogStream,
});

// Create middleware for error logging
const errorLogMiddleware = morgan(formatLogMessage, {
  stream: errorLogStream,
  skip: (req, res) => res.statusCode < 400,
});

// Export the middleware functions
module.exports = { accessLogMiddleware, errorLogMiddleware };
