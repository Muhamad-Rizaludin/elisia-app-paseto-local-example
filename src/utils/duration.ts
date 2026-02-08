const DURATION_MAP: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000
};

export const durationToMs = (duration: string): number => {
  const pattern = /^(\d+)([smhd])$/;
  const match = duration.match(pattern);

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const value = Number(match[1]);
  const unit = match[2];

  return value * DURATION_MAP[unit];
};
