const PRIVACY_PATTERN = ["redacted for privacy"];

export async function is_privacy(name: string) {
  return await new Promise((resolve) => {
    const match = PRIVACY_PATTERN.some((pattern) => {
      const regex = new RegExp(pattern, "i");
      return regex.test(name);
    });

    resolve(match);
  });
}
