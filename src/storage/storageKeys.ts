export function userKey(userId: string, key: string) {
  return `@nao_tome_multa:${userId}:${key}`;
}

export const StorageBuckets = {
  technicalProfile: 'technical_profile:v1',
  defesas: 'defesas:v1',
  statusMultas: 'status_multas:v1',
  lastReadStatusAt: 'last_read_status_at:v1',
} as const;
