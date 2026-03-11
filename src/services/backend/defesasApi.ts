/**
 * Contrato de API — Infrações e Defesas
 * Endpoint base: .cursor/docs/endpoints.md
 * Arquivo de serviço local: src/components/defesas/storage.ts
 *
 * Este arquivo contém stubs para integração futura com o backend.
 * Enquanto o backend não estiver disponível, o storage.ts usa AsyncStorage.
 */

import { InfractionInput } from '../infractions/types';
import { InconsistencyRule } from '../../data/inconsistencies/types';

/* ─── INFRAÇÕES ─── */

export interface RemoteInfractionSummary {
  id: string;
  aitNumber: string;
  description: string;
  analyzedAt: string;
  hasInconsistencies: boolean;
}

export interface RemoteInfractionDetail {
  id: string;
  input: InfractionInput;
  analysis: {
    hasInconsistencies: boolean;
    findings: InconsistencyRule[];
    summary: string;
  };
}

export interface CreateInfractionResponse {
  id: string;
  createdAt: string;
}

/**
 * GET /infractions
 * Lista infrações salvas do usuário.
 */
export async function fetchInfractions(_token: string): Promise<RemoteInfractionSummary[]> {
  throw new Error('Backend not yet available. Use storage.ts (local stub).');
}

/**
 * POST /infractions
 * Salva uma nova infração para análise.
 */
export async function createInfraction(
  _token: string,
  _input: InfractionInput,
): Promise<CreateInfractionResponse> {
  throw new Error('Backend not yet available. Use storage.ts (local stub).');
}

/**
 * GET /infractions/:id
 * Detalhe de uma infração específica.
 */
export async function fetchInfractionById(
  _token: string,
  _id: string,
): Promise<RemoteInfractionDetail> {
  throw new Error('Backend not yet available. Use storage.ts (local stub).');
}

/**
 * DELETE /infractions/:id
 * Remove uma infração do histórico.
 */
export async function deleteInfraction(_token: string, _id: string): Promise<void> {
  throw new Error('Backend not yet available. Use storage.ts (local stub).');
}

/* ─── DEFESAS ─── */

export interface RemoteDefesaSummary {
  id: string;
  infractionId: string;
  updatedAt: string;
}

export interface RemoteDefesaDetail {
  id: string;
  infractionId: string;
  defesaPrevia: string;
  recursoJARI: string;
  updatedAt: string;
}

export interface CreateDefesaResponse {
  id: string;
  createdAt: string;
}

/**
 * GET /defesas
 * Lista defesas geradas pelo usuário.
 */
export async function fetchDefesas(_token: string): Promise<RemoteDefesaSummary[]> {
  throw new Error('Backend not yet available. Use storage.ts (local stub).');
}

/**
 * POST /defesas
 * Salva uma defesa gerada localmente no backend.
 */
export async function createDefesa(
  _token: string,
  _infractionId: string,
  _defesaPrevia: string,
  _recursoJARI: string,
  _findingCodes: string[],
): Promise<CreateDefesaResponse> {
  throw new Error('Backend not yet available. Use storage.ts (local stub).');
}

/**
 * GET /defesas/:id
 * Detalhe de uma defesa.
 */
export async function fetchDefesaById(
  _token: string,
  _id: string,
): Promise<RemoteDefesaDetail> {
  throw new Error('Backend not yet available. Use storage.ts (local stub).');
}

/**
 * DELETE /defesas/:id
 * Remove uma defesa.
 */
export async function deleteDefesaRemote(_token: string, _id: string): Promise<void> {
  throw new Error('Backend not yet available. Use storage.ts (local stub).');
}
