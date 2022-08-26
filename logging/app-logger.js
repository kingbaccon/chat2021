const fs = require('fs');
const { Console } = require('console');
const { formatDate } = require('../utils/date-formatter');

const LogLevel = {
  debug: 0,
  verbose: 1,
  info: 2,
  warning: 3,
  error: 4,
};
let globalLogLevelCode = LogLevel.debug;

function setGlobalLogLevel(logLevel) {
  globalLogLevelCode = logLevel || LogLevel.debug;
}

const Color = {
  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[3m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
};

const output = fs.createWriteStream('./logs/stdout.log');
const errorOutput = fs.createWriteStream('./logs/stderr.log');

const fileLogger = new Console({ stdout: output, stderr: errorOutput });
const consoleLogger = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
});

const log = {
  debug: (msg) => {
    if (globalLogLevelCode <= LogLevel.debug) writeLog(msg, Color.FgBlue);
  },
  verbose: (msg) => {
    if (globalLogLevelCode <= LogLevel.verbose) writeLog(msg, Color.FgBlack);
  },
  info: (msg) => {
    if (globalLogLevelCode <= LogLevel.info) writeLog(msg, Color.FgGreen);
  },
  warning: (msg) => {
    if (globalLogLevelCode <= LogLevel.warning) writeLog(msg, Color.FgYellow);
  },
  error: (msg) => {
    if (globalLogLevelCode <= LogLevel.error) writeLog(msg, Color.FgRed);
  },
};

function writeLog(msg, colorCode) {
  consoleLogger.log(colorCode ? colorCode : '', msg, '\x1b[0m');
}

function startWithRequestLog(req, _res, next) {
  // Custom simple logger:
  req.log = `${formatDate(new Date())};${req.method};${req.url}`;
  next();
}

function endWithResponseLog(req, res, next) {
  fileLogger.log(`${req.log};${formatDate(new Date())};${res.statusCode}`);
  next();
}

fileLogger.log(`req received;method;url;res sent;statusCode`);

// is a kind of an alias
module.exports.log = log;
module.exports.LogLevel = LogLevel;
module.exports.setGlobalLogLevel = setGlobalLogLevel;

module.exports.startWithRequestLog = startWithRequestLog;
module.exports.endWithResponseLog = endWithResponseLog;
