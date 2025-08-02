import { expect, test } from "vitest";
import { improve_informations, Information, merge_data_array } from "./type";

test("get_best_data_array", () => {
  const array1: Information<string>[] = [
    {
      value: "value1",
      verified: true,
      sources: [],
    },
    {
      value: "value1",
      verified: true,
      sources: [],
    },
  ];

  const array2: Information<string>[] = [
    {
      value: "value2",
      verified: true,
      sources: [],
    },
    {
      value: "value3",
      verified: false,
      sources: [],
    },
  ];

  expect(merge_data_array(array1, array2)).toStrictEqual([
    {
      value: "value1",
      verified: true,
      sources: [],
    },
    {
      value: "value2",
      verified: true,
      sources: [],
    },
  ] satisfies typeof array1);
});

test("improve_data_array same", () => {
  const array: Information<string>[] = [
    {
      value: "value",
      verified: false,
      sources: [],
    },
  ];
  const data: Information<string> = {
    value: "value",
    verified: false,
    sources: [],
  };

  expect(improve_informations(array, data)).toStrictEqual([
    {
      value: "value",
      verified: false,
      sources: [],
    },
  ] satisfies typeof array);
});

test("improve_data_array better verification", () => {
  const array: Information<string>[] = [
    {
      value: "value",
      verified: false,
      sources: [],
    },
  ];
  const data: Information<string> = {
    value: "value",
    verified: true,
    sources: [],
  };

  expect(improve_informations(array, data)).toStrictEqual([
    {
      value: "value",
      sources: [],
      verified: true,
    },
  ] satisfies typeof array);
});

test("improve_data_array worst verification", () => {
  const array: Information<string>[] = [
    {
      value: "value",
      verified: true,
      sources: [],
    },
  ];
  const data: Information<string> = {
    value: "value",
    verified: false,
    sources: [],
  };

  expect(improve_informations(array, data)).toStrictEqual([
    {
      value: "value",
      sources: [],
      verified: true,
    },
  ] satisfies typeof array);
});

test("improve_data_array add link", () => {
  const array: Information<string>[] = [
    {
      value: "value",
      verified: true,
      sources: [
        {
          organization: "organization",
          links: ["link1"],
        },
      ],
    },
  ];
  const data: Information<string> = {
    value: "value",
    verified: true,
    sources: [
      {
        organization: "organization",
        links: ["link2"],
      },
    ],
  };

  expect(improve_informations(array, data)).toStrictEqual([
    {
      value: "value",
      verified: true,
      sources: [
        {
          organization: "organization",
          links: ["link1", "link2"],
        },
      ],
    },
  ] satisfies typeof array);
});

test("improve_data_array same link", () => {
  const array: Information<string>[] = [
    {
      value: "value",
      verified: true,
      sources: [
        {
          organization: "organization",
          links: ["link"],
        },
      ],
    },
  ];
  const data: Information<string> = {
    value: "value",
    verified: true,
    sources: [
      {
        organization: "organization",
        links: ["link"],
      },
    ],
  };

  expect(improve_informations(array, data)).toStrictEqual([
    {
      value: "value",
      verified: true,
      sources: [
        {
          organization: "organization",
          links: ["link"],
        },
      ],
    },
  ] satisfies typeof array);
});

test("improve_data_array different organisation", () => {
  const array: Information<string>[] = [
    {
      value: "value",
      verified: true,
      sources: [
        {
          organization: "organization1",
          links: ["link"],
        },
      ],
    },
    {
      value: "value",
      verified: true,
      sources: [
        {
          organization: "organization2",
          links: ["link"],
        },
      ],
    },
  ];
  const data: Information<string> = {
    value: "value",
    verified: true,
    sources: [
      {
        organization: "organization1",
        links: ["link"],
      },
    ],
  };

  expect(improve_informations(array, data)).toStrictEqual([
    {
      value: "value",
      verified: true,
      sources: [
        {
          organization: "organization1",
          links: ["link"],
        },
      ],
    },
    {
      value: "value",
      verified: true,
      sources: [
        {
          organization: "organization2",
          links: ["link"],
        },
      ],
    },
  ] satisfies typeof array);
});

test("improve_data_array add country", () => {
  const array: Information<string>[] = [
    {
      value: "value",
      verified: true,
      sources: [
        {
          organization: "org",
          links: [],
        },
      ],
    },
  ];
  const data: Information<string> = {
    value: "value",
    verified: true,
    sources: [
      {
        organization: "org",
        country: "country",
        links: [],
      },
    ],
  };

  expect(improve_informations(array, data)).toStrictEqual([
    {
      value: "value",
      verified: true,
      sources: [
        {
          organization: "org",
          country: "country",
          links: [],
        },
      ],
    },
  ] satisfies typeof array);
});
