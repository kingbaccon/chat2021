const newman = require('newman');

function runTests(testCollectionPath, reporters) {
  testCollectionPath = testCollectionPath || './chat2021-tests.json';
  const testCollection = require(testCollectionPath);
  const _reporters = reporters || 'cli';
  let reporter = null;

  if (_reporters === 'htmlextra') {
    reporter = {
      htmlextra: {
        export: './report.html',
      },
    };
  }
  newman.run(
    {
      collection: testCollection,
      reporters: _reporters,
      reporter: reporter,
      timeoutRequest: 1500,
    },
    (err) => {
      if (err) throw err;
      console.log(`Collection ${testCollectionPath} run complete!`);
      process.exit(0);
    },
  );
}

module.exports = { runTests };
