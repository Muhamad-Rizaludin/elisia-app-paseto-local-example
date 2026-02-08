type StoreItem = {
  count: number;
  expiredAt: number;
};

const limiterStore = new Map<string, StoreItem>();

export const increaseRateLimit = (key: string, windowMs: number): StoreItem => {
  const now = Date.now();
  const current = limiterStore.get(key);

  if (!current || now > current.expiredAt) {
    const fresh = {
      count: 1,
      expiredAt: now + windowMs
    };
    limiterStore.set(key, fresh);
    return fresh;
  }

  current.count += 1;
  limiterStore.set(key, current);
  return current;
};

export const clearRateLimitStore = () => {
  limiterStore.clear();
};
