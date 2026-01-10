const ZAPAY_API_URL = 'https://api.usezapay.com.br/v1';
const ZAPAY_SECRET = 'SUA_CHAVE_AQUI'; // No futuro, isso vai para um .env

export const fetchInfractions = async (plate: string, renavam: string) => {
  try {
    const response = await fetch(`${ZAPAY_API_URL}/consultar-debitos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZAPAY_SECRET}`,
      },
      body: JSON.stringify({
        placa: plate,
        renavam: renavam,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha técnica na consulta aos órgãos de trânsito.');
    }

    return await response.json();
  } catch (error) {
    // Postura contida: não expõe erros técnicos ao usuário
    throw new Error('Sistema indisponível momentaneamente.');
  }
};