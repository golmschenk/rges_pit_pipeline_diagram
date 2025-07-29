export type Brand<K, T extends readonly string[]> = K & { [P in T[number] as `__brand_${P}`]: true };
