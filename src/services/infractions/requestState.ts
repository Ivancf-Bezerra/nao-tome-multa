/**
 * Estados possíveis de uma requisição de serviço.
 * Usado para padronizar chamadas assíncronas no app.
 */
export type RequestStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

/**
 * Estrutura genérica de estado de requisição.
 * T representa o tipo de dado retornado pelo serviço.
 */
export interface RequestState<T> {
  status: RequestStatus;
  data: T | null;
  error: string | null;
}
