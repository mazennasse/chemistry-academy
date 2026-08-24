export const httpError = (status, message, details = undefined) => {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  return error;
};
