type ErrorType = "UserError" | "SourceError" | "FeatureError";

export function user_error(message: string) {
  return custom_error(message, "UserError");
}

export function source_error(message: string) {
  return custom_error(message, "SourceError");
}

export function feature_error(message: string) {
  return custom_error(message, "FeatureError");
}

function custom_error(message: string, type: ErrorType) {
  const error = new Error(message);
  error.name = type;

  return error;
}
