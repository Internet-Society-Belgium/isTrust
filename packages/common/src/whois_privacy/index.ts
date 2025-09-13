const PRIVACY_STRINGS = ["redacted for privacy"];

export async function is_privacy(name: string) {
  const key = encode(name);

  return await new Promise((resolve) => {
    const match = PRIVACY_STRINGS.includes(key);
    resolve(match);
  });
}

function encode(value: string) {
  value = value.toLowerCase();
  value = value.replaceAll(/[^a-zA-Z0-9 ]/g, "");
  return value;
}
