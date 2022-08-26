const createLogger = (logContainerSelector) => {
  function logInfo(msg) {
    log(msg, 'logLabel');
  }

  function logError(msg) {
    log(msg, 'errLabel');
  }

  function logSuccess(msg) {
    log(msg, 'successLabel');
  }

  function log(msg, classLabel) {
    if (typeof classLabel === 'string') {
      classLabel = 'class="' + classLabel + '"';
    } else {
      classLabel = '';
    }

    let logElem = document.querySelector(logContainerSelector);
    let timeStamp = new Date();
    //let timeStr = time.toLocaleTimeString();
    let timeStr =
      pad(timeStamp.getHours()) +
      ':' +
      pad(timeStamp.getMinutes()) +
      ':' +
      pad(timeStamp.getSeconds());
    logElem.innerHTML =
      '<label ' +
      classLabel +
      '>' +
      timeStr +
      ' > ' +
      msg +
      '</label><br/>' +
      logElem.innerHTML;
  }

  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  return {
    log: logInfo,
    info: logInfo,
    error: logError,
    success: logSuccess,
  };
};
