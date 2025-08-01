export interface VerificationAuthority {
  organization: string;
  country?: string;
  links: string[];
}

interface Verification {
  status: "unverified" | "verified";
  authorities: VerificationAuthority[];
}

export interface Data<T> {
  value: T;
  verification: Verification;
}

export function merge_data_array<T>(
  array1: Data<T>[] | undefined,
  array2: Data<T>[] | undefined,
) {
  let array = [...(array1 || []), ...(array2 || [])];
  if (array.length === 0) return;

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

  if (unique.length === 0) return;

  return unique;
}

export function improve_data_array<T>(array: Data<T>[], data: Data<T>) {
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

  for (const authority of data.verification.authorities) {
    const improvedAuthority = improve_authority_array(
      match.verification.authorities,
      authority,
    );
    if (improvedAuthority.length > 0) {
      match.verification.authorities = improvedAuthority;
    }
  }

  return array;
}

function improve_authority_array(
  array: VerificationAuthority[],
  data: VerificationAuthority,
) {
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

    for (const link of data.links) {
      if (!match.links.includes(link)) {
        match.links.push(link);
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
    get(key: string): Promise<string | undefined>;
    clear(): Promise<void>;
  };
  rdap: {
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | undefined>;
    clear(): Promise<void>;
  };
}
