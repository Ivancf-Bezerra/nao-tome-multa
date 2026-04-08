import { ORGAO_JARI_LINKS, type OrgaoJariLink } from '../../data/jari/orgaoLinks';

export interface JARILink {
  label: string;
  url: string;
  isFallback: boolean;
}

/**
 * Normaliza códigos e nomes de órgão para busca no mapa de links.
 */
function normalizeKey(value?: string): string | undefined {
  if (!value) return undefined;
  return value.trim().toUpperCase();
}

/**
 * Retorna o link mais adequado para acessar o sistema do órgão responsável
 * pelo recurso à JARI. Este link é usado apenas para exibição/cópia – o app
 * não abre automaticamente o sistema.
 */
export function buildJARILink(
  issuingBodyCode?: string,
  issuingBodyName?: string,
  uf?: string,
): JARILink {
  const codeKey = normalizeKey(issuingBodyCode);
  const nameKey = normalizeKey(issuingBodyName);
  const ufKey = normalizeKey(uf);

  let direct: OrgaoJariLink | undefined;

  // 1) Tentar por código exato (ex.: DETRAN-SP, PRF, CET-SP)
  if (codeKey && ORGAO_JARI_LINKS[codeKey]) {
    direct = ORGAO_JARI_LINKS[codeKey];
  }

  // 2) Tentar por UF assumindo DETRAN-UF (ex.: SP → DETRAN-SP)
  if (!direct && ufKey) {
    const detranKey = `DETRAN-${ufKey}`;
    if (ORGAO_JARI_LINKS[detranKey]) {
      direct = ORGAO_JARI_LINKS[detranKey];
    }
  }

  if (direct) {
    return {
      label: direct.label,
      url: direct.url,
      isFallback: false,
    };
  }

  // 3) Fallback: busca genérica no Google para o órgão + "recurso JARI"
  const term = (issuingBodyName || issuingBodyCode || 'órgão de trânsito').trim();
  const query = encodeURIComponent(`${term} recurso JARI`);

  return {
    label: 'Buscar sistema do órgão',
    url: `https://www.google.com/search?q=${query}`,
    isFallback: true,
  };
}

