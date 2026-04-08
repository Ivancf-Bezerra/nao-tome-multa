export type OrgaoJariLink = {
  label: string;
  url: string;
};

/**
 * Mapa inicial de órgãos → link para sistema de recursos / JARI.
 *
 * IMPORTANTE:
 * - Estes links são exemplos e devem ser revisados antes de ir para produção.
 * - Expanda esta lista conforme surgirem novos órgãos na base de usuários.
 */
export const ORGAO_JARI_LINKS: Record<string, OrgaoJariLink> = {
  // Exemplos por código / sigla do órgão (ajuste de acordo com o que é salvo em issuingBodyCode)
  'DETRAN-SP': {
    label: 'Sistema de recursos do DETRAN-SP',
    url: 'https://www.detran.sp.gov.br/',
  },
  'DETRAN-RJ': {
    label: 'Sistema de recursos do DETRAN-RJ',
    url: 'https://www.detran.rj.gov.br/',
  },
  PRF: {
    label: 'Sistema de recursos da PRF',
    url: 'https://www.prf.gov.br/',
  },
  'CET-SP': {
    label: 'Sistema de recursos da CET-SP',
    url: 'https://www.cetsp.com.br/',
  },
  // TODO: adicionar outros órgãos relevantes usados pelos usuários do app
};

