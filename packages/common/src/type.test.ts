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
  ] satisfies typeof array);
});

test("improve_data_array better status", () => {
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
      authority: [],
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        authority: [],
        status: "verified",
      },
    },
  ] satisfies typeof array);
});

test("improve_data_array worst status", () => {
  const array: Data<string>[] = [
    {
      value: "value",
      verification: {
        status: "verified",
        authority: [],
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
        authority: [],
        status: "verified",
      },
    },
  ] satisfies typeof array);
});

test("improve_data_array add link", () => {
  const array: Data<string>[] = [
    {
      value: "value",
      verification: {
        status: "verified",
        authority: [
          {
            organization: "organization",
            links: ["link1"],
          },
        ],
      },
    },
  ];
  const data: Data<string> = {
    value: "value",
    verification: {
      status: "verified",
      authority: [
        {
          organization: "organization",
          links: ["link2"],
        },
      ],
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        status: "verified",
        authority: [
          {
            organization: "organization",
            links: ["link1", "link2"],
          },
        ],
      },
    },
  ] satisfies typeof array);
});

test("improve_data_array same link", () => {
  const array: Data<string>[] = [
    {
      value: "value",
      verification: {
        status: "verified",
        authority: [
          {
            organization: "organization",
            links: ["link"],
          },
        ],
      },
    },
  ];
  const data: Data<string> = {
    value: "value",
    verification: {
      status: "verified",
      authority: [
        {
          organization: "organization",
          links: ["link"],
        },
      ],
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        status: "verified",
        authority: [
          {
            organization: "organization",
            links: ["link"],
          },
        ],
      },
    },
  ] satisfies typeof array);
});

test("improve_data_array different organisation", () => {
  const array: Data<string>[] = [
    {
      value: "value",
      verification: {
        status: "verified",
        authority: [
          {
            organization: "organization1",
            links: ["link"],
          },
        ],
      },
    },
    {
      value: "value",
      verification: {
        status: "verified",
        authority: [
          {
            organization: "organization2",
            links: ["link"],
          },
        ],
      },
    },
  ];
  const data: Data<string> = {
    value: "value",
    verification: {
      status: "verified",
      authority: [
        {
          organization: "organization1",
          links: ["link"],
        },
      ],
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        status: "verified",
        authority: [
          {
            organization: "organization1",
            links: ["link"],
          },
        ],
      },
    },
    {
      value: "value",
      verification: {
        status: "verified",
        authority: [
          {
            organization: "organization2",
            links: ["link"],
          },
        ],
      },
    },
  ] satisfies typeof array);
});

test("improve_data_array add country", () => {
  const array: Data<string>[] = [
    {
      value: "value",
      verification: {
        status: "verified",
        authority: [
          {
            organization: "org",
          },
        ],
      },
    },
  ];
  const data: Data<string> = {
    value: "value",
    verification: {
      status: "verified",
      authority: [
        {
          organization: "org",
          country: "country",
        },
      ],
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        status: "verified",
        authority: [
          {
            organization: "org",
            country: "country",
          },
        ],
      },
    },
  ] satisfies typeof array);
});
