export interface InternalCache {
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
