export interface VerificationAuthority {
  organization?: string;
  country?: string;
  links?: string[];
}

export interface Data<T> {
  value: T;
  verification:
    | {
        status: "unverified";
        by?: VerificationAuthority;
      }
    | {
        status: "verified";
        by: VerificationAuthority;
      };
}

export function improve_data_array<T>(
  array: Data<T>[] | undefined,
  data: Data<T>,
) {
  if (array === undefined) return [data];

  let match: Data<T> | undefined;
  for (const a of array) {
    if (
      normalize(a.value) === normalize(data.value) &&
      normalize(a.verification.status) ===
        normalize(data.verification.status) &&
      normalize(a.verification.by?.organization) ===
        normalize(data.verification.by?.organization) &&
      normalize(a.verification.by?.country) ===
        normalize(data.verification.by?.country)
    ) {
      match = a;
      break;
    }
  }

  if (match) {
    if (match.verification.by?.links) {
      for (const link of data.verification.by?.links || []) {
        if (!match.verification.by.links.includes(link)) {
          match.verification.by.links.push(link);
        }
      }
    }
  } else {
    array.push(data);
  }

  return array;
}

function normalize(value: unknown) {
  if (typeof value === "string") {
    return value
      .replaceAll(/[^\w\d\s]/g, "")
      .trim()
      .toLowerCase();
  }

  return value;
}

export interface DataCache {
  psl: {
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
    clear(): Promise<void>;
  };
  rdap: {
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
    clear(): Promise<void>;
  };
}
