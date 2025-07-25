import { expect, test } from "vitest";
import { Data, get_best_data_array, improve_data_array } from "./type";

test("get_best_data_array", () => {
  const array: Data<string>[] = [
    {
      value: "value1",
      verification: {
        status: "verified",
        authorities: [],
      },
    },
    {
      value: "value1",
      verification: {
        status: "verified",
        authorities: [],
      },
    },
    {
      value: "value2",
      verification: {
        status: "verified",
        authorities: [],
      },
    },
    {
      value: "value3",
      verification: {
        status: "unverified",
      },
    },
  ];

  expect(get_best_data_array(array)).toStrictEqual([
    {
      value: "value1",
      verification: {
        status: "verified",
        authorities: [],
      },
    },
    {
      value: "value2",
      verification: {
        status: "verified",
        authorities: [],
      },
    },
  ] satisfies typeof array);
});

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
      authorities: [],
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        authorities: [],
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
        authorities: [],
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
        authorities: [],
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
        authorities: [
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
      authorities: [
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
        authorities: [
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
        authorities: [
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
      authorities: [
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
        authorities: [
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
        authorities: [
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
        authorities: [
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
      authorities: [
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
        authorities: [
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
        authorities: [
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
        authorities: [
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
      authorities: [
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
        authorities: [
          {
            organization: "org",
            country: "country",
          },
        ],
      },
    },
  ] satisfies typeof array);
});
