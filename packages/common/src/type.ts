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

export function merge_informations<T>(
  array1: Information<T>[] | undefined,
  array2: Information<T>[] | undefined,
) {
  let informations = [...(array1 || [])];
  for (const a2 of array2 || []) {
    informations = improve_informations(informations, a2);
  }

  return informations;
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

  if (match === undefined) {
    sources.push(source);
    return sources;
  }

  if (match.country === undefined && source.country !== undefined) {
    match.country = source.country;
  }

  for (const link of source.links) {
    const improvedLinks = improve_links(match.links, link);
    if (improvedLinks.length > 0) {
      match.links = improvedLinks;
    }
  }

  return sources;
}

export function improve_links(links: string[], link: string) {
  let match: string | undefined;
  for (const l of links) {
    try {
      const lUrl = new URL(l);
      const linkUrl = new URL(link);

      if (
        lUrl.hostname === linkUrl.hostname &&
        lUrl.pathname === linkUrl.pathname
      ) {
        match = l;
        break;
      }
    } catch {
      if (l === link) {
        match = l;
        break;
      }
    }
  }

  if (match === undefined) {
    links.push(link);
  }

  return links;
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
