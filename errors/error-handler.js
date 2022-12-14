// responsibilty:
// get an error-object, try to find out which type of error has occured
// answer the http-request with the correct http status error-code
// last fallback is always 500 - internal server error
// differ between EXPECTED and UNEXPECTED Errors
function errorHandler(err, _req, res, next) {
    let defaultErrorCode = 500;
  
    let errCode = err.code || defaultErrorCode;
    if (errCode < 400 || errCode > 599) {
      console.error(
        `wrong http error code. got ${errCode}, set to ${defaultErrorCode}`,
      );
      errCode = defaultErrorCode;
    }
    if (errCode === defaultErrorCode) {
      console.log('unexpected error occured');
      console.error(err);
    }
  
    // try to build a correct error object to answer the request
    let errToSend = {
      code: errCode,
      message: err?.message || 'internal server error',
    };
  
    res.status(errCode).json(errToSend);
    // to finish the logging
    next();
  }
  
  function handleAsyncError(fn) {
    return (req, res, next) => {
      // if fn is an async function,
      // get the promise object and add a catch error handler
      // otherwise the default exceptionhandling will do the job
      try {
        const returnedPromise = fn(req, res, next);
        // next() must be called - in both cases (err XOR noErr)
        // to call the function which writes the log-entry into the log-file
        // (it's the last middleware function)
        if (returnedPromise) {
          returnedPromise.then(() => next()).catch((err) => next(err));
        } else {
          next();
        }
      } catch (err) {
        next(err);
      }
    };
  }
  
  module.exports.errorHandler = errorHandler;
  module.exports.handleAsyncError = handleAsyncError;
  