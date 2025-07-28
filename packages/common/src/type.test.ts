import { expect, test } from "vitest";
import { Data, merge_data_array, improve_data_array } from "./type";

test("get_best_data_array", () => {
  const array1: Data<string>[] = [
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
  ];

  const array2: Data<string>[] = [
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
        authorities: null,
      },
    },
  ];

  expect(merge_data_array(array1, array2)).toStrictEqual([
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
  ] satisfies typeof array1);
});

test("improve_data_array same", () => {
  const array: Data<string>[] = [
    {
      value: "value",
      verification: {
        status: "unverified",
        authorities: null,
      },
    },
  ];
  const data: Data<string> = {
    value: "value",
    verification: {
      status: "unverified",
      authorities: null,
    },
  };

  expect(improve_data_array(array, data)).toStrictEqual([
    {
      value: "value",
      verification: {
        status: "unverified",
        authorities: null,
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
        authorities: null,
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
      authorities: null,
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
            country: null,
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
          country: null,
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
            country: null,
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
            country: null,
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
          country: null,
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
            country: null,
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
            country: null,
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
            country: null,
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
          country: null,
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
            country: null,
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
            country: null,
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
            country: null,
            links: null,
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
          links: null,
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
            links: null,
          },
        ],
      },
    },
  ] satisfies typeof array);
});
