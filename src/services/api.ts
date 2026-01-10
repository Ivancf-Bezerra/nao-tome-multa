import Constants from 'expo-constants';

const ZAPAY_BASE_URL = 'https://api.zapay.com.br';

const ZAPAY_TOKEN = Constants.expoConfig?.extra?.ZAPAY_API_KEY;

type FetchParams = {
  plate: string;
  renavam: string;
  uf: string;
};

export async function fetchInfractions(params: FetchParams) {
  if (!ZAPAY_TOKEN) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: 'ZAPAY_TOKEN_MISSING',
    };
  }

  try {
    const response = await fetch(
      `${ZAPAY_BASE_URL}/zapi/debts/?plate=${params.plate}&renavam=${params.renavam}&uf=${params.uf}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ZAPAY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data: null,
        error: 'ZAPAY_REQUEST_FAILED',
        raw: data,
      };
    }

    return {
      ok: true,
      status: response.status,
      data,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: 'ZAPAY_NETWORK_ERROR',
    };
  }
}
