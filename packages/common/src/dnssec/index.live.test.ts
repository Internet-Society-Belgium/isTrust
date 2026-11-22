import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org", async () => {
  const data = await get_data("istrust.org", true);

  console.log(
    `From: ${JSON.stringify(
      data?.valid?.sources.map(({ organization }) => organization),
    )}`,
  );

  expect(data).toMatchObject({
    valid: {
      value: false,
    },
  });
});

test("internetsociety.org", async () => {
  const data = await get_data("internetsociety.org", true);

  console.log(
    `From: ${JSON.stringify(
      data?.valid?.sources.map(({ organization }) => organization),
    )}`,
  );

  expect(data).toMatchObject({
    valid: {
      value: true,
    },
  });
});

test("icann.org", async () => {
  const data = await get_data("icann.org", true);

  console.log(
    `From: ${JSON.stringify(
      data?.valid?.sources.map(({ organization }) => organization),
    )}`,
  );

  expect(data).toMatchObject({
    valid: {
      value: true,
    },
  });
});
