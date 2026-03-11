/**
 * Cliente HTTP centralizado para integração com o backend NTM.
 * Stub — substituir pela URL real quando o backend estiver disponível.
 *
 * Endpoint base documentado em: .cursor/docs/endpoints.md
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.naotomemulta.com.br/v1';

export type ApiResponse<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status: number };

export async function apiGet<T>(
  path: string,
  token: string,
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data?.message ?? 'Request failed', status: response.status };
    }

    return { ok: true, data: data as T, status: response.status };
  } catch {
    return { ok: false, error: 'NETWORK_ERROR', status: 0 };
  }
}

export async function apiPost<T>(
  path: string,
  token: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data?.message ?? 'Request failed', status: response.status };
    }

    return { ok: true, data: data as T, status: response.status };
  } catch {
    return { ok: false, error: 'NETWORK_ERROR', status: 0 };
  }
}

export async function apiDelete(
  path: string,
  token: string,
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { ok: false, error: 'Request failed', status: response.status };
    }

    return { ok: true, data: undefined, status: response.status };
  } catch {
    return { ok: false, error: 'NETWORK_ERROR', status: 0 };
  }
}
