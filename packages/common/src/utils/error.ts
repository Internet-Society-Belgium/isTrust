type ErrorType = "UserError" | "SourceError";

export function user_error(message: string) {
  return custom_error(message, "UserError");
}

export function source_error(message: string) {
  return custom_error(message, "SourceError");
}

function custom_error(message: string, type: ErrorType) {
  const error = new Error(message);
  error.name = type;

  return error;
}
