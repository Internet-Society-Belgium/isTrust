export interface VerificationAuthority {
  organization?: string;
  country?: string;
  links?: string[];
}

export type Verification =
  | {
      status: "unverified";
      authorities?: VerificationAuthority[];
    }
  | {
      status: "verified";
      authorities: VerificationAuthority[];
    };

export interface Data<T> {
  value: T;
  verification: Verification;
}

export function improve_data_array<T>(
  array: Data<T>[] | undefined,
  data: Data<T>,
) {
  if (array === undefined) return [data];

  let match: Data<T> | undefined;
  for (const a of array) {
    if (normalize(a.value) === normalize(data.value)) {
      match = a;
      break;
    }
  }

  if (match === undefined) {
    array.push(data);
    return array;
  }

  if (
    match.verification.status === "verified" &&
    data.verification.status === "unverified"
  ) {
    return array;
  }

  if (
    match.verification.status === "unverified" &&
    data.verification.status === "verified"
  ) {
    match.verification = { ...data.verification };
    return array;
  }

  if (
    match.verification.authorities !== undefined &&
    data.verification.authorities !== undefined
  ) {
    for (const authority of data.verification.authorities) {
      const improvedAuthority = improve_authority_array(
        match.verification.authorities,
        authority,
      );
      if (improvedAuthority.length > 0) {
        match.verification.authorities = improvedAuthority;
      }
    }
  }

  return array;
}

function improve_authority_array(
  array: VerificationAuthority[] | undefined,
  data: VerificationAuthority,
) {
  if (array === undefined) return [data];

  let match: VerificationAuthority | undefined;
  for (const a of array) {
    if (
      normalize(a.organization) === normalize(data.organization) &&
      (a.country === undefined ||
        normalize(a.country) === normalize(data.country))
    ) {
      match = a;
      break;
    }
  }

  if (match) {
    if (match.country === undefined && data.country !== undefined) {
      match.country = data.country;
    }

    if (match.links !== undefined) {
      if (data.links !== undefined) {
        for (const link of data.links) {
          if (!match.links.includes(link)) {
            match.links.push(link);
          }
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
      .normalize("NFKD")
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
