/**
 * Contrato de API — Assinatura
 * Endpoint base: .cursor/docs/endpoints.md
 * Arquivo de serviço local: src/services/subscription/subscriptionService.ts
 *
 * Este arquivo contém stubs para integração futura com o backend.
 * Enquanto o backend não estiver disponível, o subscriptionService.ts
 * usa AsyncStorage como fallback local.
 */

import { PlanType } from '../../context/SubscriptionContext';

export interface RemoteSubscriptionData {
  plan: PlanType;
  isActive: boolean;
  expiresAt: string | null;
  renewsAt: string | null;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export interface CancelResponse {
  canceledAt: string;
  activeUntil: string;
}

/**
 * GET /user/subscription
 * Retorna o plano atual do usuário autenticado.
 */
export async function fetchSubscription(
  _token: string,
): Promise<RemoteSubscriptionData> {
  throw new Error('Backend not yet available. Use subscriptionService.ts (local stub).');
}

/**
 * POST /subscription/checkout
 * Inicia sessão de checkout para aquisição de plano.
 */
export async function initiateCheckout(
  _token: string,
  _planId: PlanType,
): Promise<CheckoutResponse> {
  throw new Error('Backend not yet available. Payment gateway TBD.');
}

/**
 * DELETE /subscription
 * Cancela o plano ativo do usuário.
 */
export async function cancelSubscription(_token: string): Promise<CancelResponse> {
  throw new Error('Backend not yet available. Use subscriptionService.ts (local stub).');
}
