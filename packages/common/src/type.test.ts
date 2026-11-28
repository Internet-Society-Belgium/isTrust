import { expect, test } from "vitest";
import { improve_informations, Information, merge_informations } from "./type";

test("merge_data_array", () => {
  const array1: Information<string>[] = [
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
  ];

  const array2: Information<string>[] = [
    {
      value: "value2",
      verified: false,
      sources: [],
    },
    {
      value: "value3",
      verified: false,
      sources: [],
    },
  ];

  expect(merge_informations(array1, array2)).toStrictEqual([
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
    {
      value: "value3",
      verified: false,
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
          links: ["http://link1/path1"],
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
        links: ["http://link1/path2"],
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
          links: ["http://link1/path1", "http://link1/path2"],
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

test("improve_data_array add source from another organization", () => {
  const array: Information<string>[] = [
    {
      value: "value",
      verified: true,
      sources: [{ organization: "organization1", links: [] }],
    },
  ];
  const data: Information<string> = {
    value: "value",
    verified: true,
    sources: [{ organization: "organization2", links: [] }],
  };

  expect(improve_informations(array, data)).toStrictEqual([
    {
      value: "value",
      verified: true,
      sources: [
        { organization: "organization1", links: [] },
        { organization: "organization2", links: [] },
      ],
    },
  ] satisfies typeof array);
});

test("improve_data_array add source from another country", () => {
  const array: Information<string>[] = [
    {
      value: "value",
      verified: true,
      sources: [{ organization: "org", country: "BE", links: [] }],
    },
  ];
  const data: Information<string> = {
    value: "value",
    verified: true,
    sources: [{ organization: "org", country: "FR", links: [] }],
  };

  expect(improve_informations(array, data)).toStrictEqual([
    {
      value: "value",
      verified: true,
      sources: [
        { organization: "org", country: "BE", links: [] },
        { organization: "org", country: "FR", links: [] },
      ],
    },
  ] satisfies typeof array);
});

test("improve_data_array source without country matches", () => {
  const array: Information<string>[] = [
    {
      value: "value",
      verified: true,
      sources: [{ organization: "org", country: "BE", links: [] }],
    },
  ];
  const data: Information<string> = {
    value: "value",
    verified: true,
    sources: [{ organization: "org", links: ["link"] }],
  };

  expect(improve_informations(array, data)).toStrictEqual([
    {
      value: "value",
      verified: true,
      sources: [{ organization: "org", country: "BE", links: ["link"] }],
    },
  ] satisfies typeof array);
});

test("improve_informations keeps two distinct sources", () => {
  const informations: Information<string>[] = [
    {
      value: "BE",
      sources: [{ organization: "A", links: [] }],
    },
  ];

  const merged = improve_informations(informations, {
    value: "BE",
    sources: [{ organization: "B", links: [] }],
  });

  expect(merged[0]?.sources.map((s) => s.organization)).toStrictEqual([
    "A",
    "B",
  ]);
});

test("improve_informations clears proxy on verified non-proxy source", () => {
  const informations: Information<string>[] = [
    {
      value: "US",
      verified: false,
      sources: [{ organization: "Privacy", links: [] }],
      proxy: true,
    },
  ];

  expect(
    improve_informations(informations, {
      value: "US",
      verified: true,
      sources: [{ organization: "Owner", links: [] }],
    }),
  ).toStrictEqual([
    {
      value: "US",
      verified: true,
      sources: [{ organization: "Owner", links: [] }],
    },
  ] satisfies typeof informations);
});

test("improve_informations clears proxy on unverified non-proxy source", () => {
  const informations: Information<string>[] = [
    {
      value: "US",
      sources: [{ organization: "Privacy", links: [] }],
      proxy: true,
    },
  ];

  const merged = improve_informations(informations, {
    value: "US",
    sources: [{ organization: "Owner", links: [] }],
  });

  expect(merged[0]).not.toHaveProperty("proxy");
});

test("improve_informations keeps proxy when every source is proxy", () => {
  const informations: Information<string>[] = [
    {
      value: "US",
      sources: [{ organization: "Privacy A", links: [] }],
      proxy: true,
    },
  ];

  const merged = improve_informations(informations, {
    value: "US",
    sources: [{ organization: "Privacy B", links: [] }],
    proxy: true,
  });

  expect(merged[0]?.proxy).toBe(true);
});

test("improve_informations omits proxy when no source is proxy", () => {
  const informations: Information<string>[] = [
    { value: "US", sources: [{ organization: "A", links: [] }] },
  ];

  const merged = improve_informations(informations, {
    value: "US",
    sources: [{ organization: "B", links: [] }],
  });

  expect(merged[0]).not.toHaveProperty("proxy");
});
