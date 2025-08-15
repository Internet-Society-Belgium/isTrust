export type ErrorType =
  | "UserError"
  | "SourceError"
  | "FeatureMissingError"
  | "FeatureRequireWebextensionError";

export function user_error(message: string) {
  return custom_error(message, "UserError");
}

export function source_error(message: string) {
  return custom_error(message, "SourceError");
}

export function feature_missing_error(message: string) {
  return custom_error(message, "FeatureMissingError");
}

export function feature_require_webextension_error(message: string) {
  return custom_error(message, "FeatureRequireWebextensionError");
}

function custom_error(message: string, type: ErrorType) {
  const error = new Error(message);
  error.name = type;

  return error;
}
