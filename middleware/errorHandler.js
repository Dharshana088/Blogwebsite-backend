const errorHandler = (err, req, res, next) => {
  
  if (console?.error) {
    console?.error?.(`[${new Date()?.toISOString?.()}] Error:`, {
      message: err?.message,
      stack: err?.stack,
      path: req?.path,
      method: req?.method,
      body: req?.body
    });
  }

  
  let statusCode = err?.statusCode || (res?.statusCode === 200 ? 500 : res?.statusCode);
  
  let message = err?.message;
  if (err?.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (err?.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  
  if (statusCode === 500) {
    message = 'Internal Server Error';
  }

  
  if (res?.status && res?.json) {
    res?.status?.(statusCode)?.json?.({
      success: false,
      message,
      error: process?.env?.NODE_ENV === 'development' ? {
        name: err?.name,
        stack: err?.stack,
        ...(err?.errors && { details: err?.errors })
      } : undefined
    });
  }
};

export default errorHandler;
