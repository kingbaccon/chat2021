/* ************************************************************************* */
/*                                Chat App                                   */
/*                                                                           */
/*  Complete Web App                                                         */
/*                                                                           */
/*                                                                           */
/*  HTL Villach - Abteilung Informatik                                       */
/*  (c) 2020/21                                                              */
/* ********************'**************************************************** */

'use strict';
const express = require('express');

const dbContext = require('./database/dbContext');
const {
  log,
  startWithRequestLog,
  endWithResponseLog,
  LogLevel,
  setGlobalLogLevel,
} = require('./logging/app-logger');

const { errorHandler } = require('./errors/error-handler');
const { runTests } = require('./tests/test-runner');

const testLinkRouter = require('./tests/test-link-router');
const messageRouter = require('./messages/message-router');
const userRouter = require('./users/user-router');
const { authenticate, authRouter } = require('./authenticate/authentification');

const app = express();

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { raw } = require('express');
const argv = yargs(hideBin(process.argv)).argv;

argv.recreateDatabase = argv.recreateDatabase || 'false';
argv.port = argv.port || '2604';
if (argv.recreateDatabase != "false" && argv.recreateDatabase != 'true') {
  console.log('recreateDatabase must to be false or true');
}
if (!argv.testCollectionPath) {
  console.log('testCollectionPath must be set');
}
if (typeof (argv.port) != 'number') {
  console.log('port must be a number');
}
if (argv.testType != 'cli' && argv.testType != 'html') {
  console.log('testType must be cli or html');
}

const main = async function () {
  // 1. central settings
  // 1.1. define Log-Level
  setGlobalLogLevel(LogLevel.debug);

  // 1.2. http-server settings
  const hostname = 'chatservice.informatik.htl-vil';
  const port = argv.port;

  // 1.3. database - settings
  const connectionString = 'mongodb://localhost/chat2021-Filipczak-Aleksander';
  const dbConnectTimeout = 3000;
  const recreateDatabase = (argv.recreateDatabase === 'true');

  log.info(`Starting Chatbackend Services ...`);
  try {
    // 2. Database Connection
    log.info(`Try to connect to "${connectionString}"`);
    await dbContext.connect({
      connectionString,
      dbConnectTimeout,
      recreateDatabase,
    });
    if (recreateDatabase) log.warning('Current Database dropped !!');

    log.info(`Database connection to ${connectionString} established.`);

    // 3. Loading Middleware and Router
    log.info(`Loading endpoints for app ...`);
    app.use(express.json());
    app.use(express.text());

    app.use(startWithRequestLog);


    //Mit einem  GET weil es wird nichts erzeugt und es werden nur Sachen an den User geschickt
    app.get("/Notes/:schueler/:grades", (req, res) => {
      try {
        
        const schueler = req.params.schueler;
        const gradesindex = req.params.grades;
        
        let arrstd = [];
        if (req.params == null) {
          res.status(400).send("no body provided");
        } else {
          if (schueler == null || gradesindex == null) {
            res.status(400).send("wrong properties provided");
          } else {
            for (let i = 0; i < schueler; i++) {
              let grades = [];
              for (let j = 0; j < gradesindex; j++) {
                grades.push(Math.floor(Math.random() * 5) + 1);
              }
              arrstd.push({ "schueler": i, "grades": grades });
            }

            console.log(arrstd);
            res.status(200).send(`${JSON.stringify(arrstd)}`);
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    // 3.1 Unauthenticated Area
    app.use('/', express.static(__dirname + '/webClient'));
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    // ------------------------
    app.use(authenticate);

    // 3.2 Authenticated Area
    app.get('/unexpected-error-test', (_req, res) => res.yyyy());
    app.use('/api/messages', messageRouter);
    app.use(errorHandler);
    app.use(endWithResponseLog);

    // 4. Start the WebServer
    log.info(`Starting WebServer ...`);
    app.listen(port, hostname, () => {
      log.info(`Chat Backend running on http://${hostname}:${port}`);

      // 4.1. Check if server was started with "npm test tests-{typeOf} {filename}"
      let testType = argv.testType;
      let testFilePath = argv.testCollectionPath;

      if (testType) {
        log.info(`start running tests with reporter "{testType}"`);
        if (testType === 'cli') runTests(testFilePath, 'cli');
        if (testType === 'html') runTests(testFilePath, 'htmlextra');
      }
    });
  } catch (err) {
    log.error(
      `Chat Backend startup problems.\n` + `App is not healthy!\n` + err,
    );
  }
};

main();
