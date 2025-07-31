export interface VerificationAuthority {
  organization: string;
  country: string | null;
  links: string[] | null;
}

interface Verification {
  status: "unverified" | "verified";
  authorities: VerificationAuthority[] | null;
}

export interface Data<T> {
  value: T;
  verification: Verification;
}

export function merge_data_array<T>(
  array1: Data<T>[] | undefined | null,
  array2: Data<T>[] | undefined | null,
) {
  if (array1 === undefined || array2 === undefined) return undefined;
  if (array1 === null && array2 === null) return null;

  let array = [...(array1 || []), ...(array2 || [])];
  if (array.length === 0) return null;

  const verified = array.filter(
    (data) => data.verification.status === "verified",
  );
  if (verified.length > 0) {
    array = verified;
  }

  const unique: Data<T>[] = [];
  for (const item of array) {
    if (!unique.some((obj) => JSON.stringify(obj) === JSON.stringify(item))) {
      unique.push(item);
    }
  }

  if (unique.length === 0) return null;

  return unique;
}

export function improve_data_array<T>(array: Data<T>[] | null, data: Data<T>) {
  if (array === null) return [data];

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
    match.verification.authorities !== null &&
    data.verification.authorities !== null
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
      (a.country === null || normalize(a.country) === normalize(data.country))
    ) {
      match = a;
      break;
    }
  }

  if (match) {
    if (match.country === null && data.country !== null) {
      match.country = data.country;
    }

    if (match.links !== null && data.links !== null) {
      for (const link of data.links) {
        if (!match.links.includes(link)) {
          match.links.push(link);
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
