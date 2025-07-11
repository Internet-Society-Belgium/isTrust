export interface InternalCache {
  psl: {
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
    lastUpdate?: number;
    flush(): Promise<void>;
  };
}
