import { expect, test } from "vitest";
import { Data, improve_data_array } from "./type";

test("improve_data_array same", () => {
  const array: Data<string>[] = [
    {
      value: "value",
      verification: {
        status: "unverified",
      },
    },
  ];
  const data: Data<string> = {
    value: "value",
    verification: {
      status: "unverified",
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        status: "unverified",
      },
    },
  ]);
});

test("improve_data_array different", () => {
  const array: Data<string>[] = [
    {
      value: "value",
      verification: {
        status: "unverified",
      },
    },
  ];
  const data: Data<string> = {
    value: "value",
    verification: {
      status: "verified",
      by: {},
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        status: "unverified",
      },
    },
    {
      value: "value",
      verification: {
        by: {},
        status: "verified",
      },
    },
  ]);
});

test("improve_data_array links", () => {
  const array: Data<string>[] = [
    {
      value: "value",
      verification: {
        status: "verified",
        by: {
          organization: "organization",
          links: ["link1"],
        },
      },
    },
  ];
  const data: Data<string> = {
    value: "value",
    verification: {
      status: "verified",
      by: {
        organization: "organization",
        links: ["link2"],
      },
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        status: "verified",
        by: {
          organization: "organization",
          links: ["link1", "link2"],
        },
      },
    },
  ]);
});

test("improve_data_array same link", () => {
  const array: Data<string>[] = [
    {
      value: "value",
      verification: {
        status: "verified",
        by: {
          organization: "organization",
          links: ["link"],
        },
      },
    },
  ];
  const data: Data<string> = {
    value: "value",
    verification: {
      status: "verified",
      by: {
        organization: "organization",
        links: ["link"],
      },
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        status: "verified",
        by: {
          organization: "organization",
          links: ["link"],
        },
      },
    },
  ]);
});

test("improve_data_array different", () => {
  const array: Data<string>[] = [
    {
      value: "value",
      verification: {
        status: "verified",
        by: {
          organization: "organization1",
          links: ["link"],
        },
      },
    },
    {
      value: "value",
      verification: {
        status: "verified",
        by: {
          organization: "organization2",
          links: ["link"],
        },
      },
    },
  ];
  const data: Data<string> = {
    value: "value",
    verification: {
      status: "verified",
      by: {
        organization: "organization1",
        links: ["link"],
      },
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        status: "verified",
        by: {
          organization: "organization1",
          links: ["link"],
        },
      },
    },
    {
      value: "value",
      verification: {
        status: "verified",
        by: {
          organization: "organization2",
          links: ["link"],
        },
      },
    },
  ]);
});
