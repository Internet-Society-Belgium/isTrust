export interface Source {
  organization: string;
  country?: string;
  links: string[];
}

export interface Information<T> {
  value: T;
  sources: Source[];
  verified?: boolean;
}

export function merge_data_array<T>(
  array1: Information<T>[] | undefined,
  array2: Information<T>[] | undefined,
) {
  let array = [...(array1 || []), ...(array2 || [])];
  if (array.length === 0) return;

  const verified = array.filter((data) => data.verified === true);
  if (verified.length > 0) {
    array = verified;
  }

  const unique: Information<T>[] = [];
  for (const item of array) {
    if (!unique.some((obj) => JSON.stringify(obj) === JSON.stringify(item))) {
      unique.push(item);
    }
  }

  if (unique.length === 0) return;

  return unique;
}

export function improve_informations<T>(
  informations: Information<T>[],
  information: Information<T>,
) {
  let match: Information<T> | undefined;
  for (const info of informations) {
    if (normalize(info.value) === normalize(information.value)) {
      match = info;
      break;
    }
  }

  if (match === undefined) {
    informations.push(information);
    return informations;
  }

  if (match.verified === true && information.verified === false) {
    return informations;
  }

  if (match.verified === false && information.verified === true) {
    match.verified = true;
    match.sources = information.sources;
    return informations;
  }

  for (const source of information.sources) {
    const improvedSources = improve_sources(match.sources, source);
    if (improvedSources.length > 0) {
      match.sources = improvedSources;
    }
  }

  return informations;
}

function improve_sources(sources: Source[], source: Source) {
  let match: Source | undefined;
  for (const source of sources) {
    if (
      normalize(source.organization) === normalize(source.organization) &&
      (source.country === undefined ||
        normalize(source.country) === normalize(source.country))
    ) {
      match = source;
      break;
    }
  }

  if (match) {
    if (match.country === undefined && source.country !== undefined) {
      match.country = source.country;
    }

    for (const link of source.links) {
      if (!match.links.includes(link)) {
        match.links.push(link);
      }
    }
  } else {
    sources.push(source);
  }

  return sources;
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

export interface InformationCache {
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
