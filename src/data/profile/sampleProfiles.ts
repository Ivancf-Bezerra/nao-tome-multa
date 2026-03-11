import { DriverData } from '../../app/profile/DriverForm';
import { VehicleData } from '../../app/profile/VehicleForm';

/**
 * Dados de exemplo para o cadastro técnico (condutor + veículo).
 * Usados em desenvolvimento para preencher o formulário e agilizar testes.
 */
export const SAMPLE_DRIVER: DriverData = {
  fullName: 'JOÃO CARLOS DA SILVA',
  cpf: '123.456.789-09',
  cnhNumber: '98765432100',
  cnhCategory: 'B',
  cnhExpiry: '15/08/2027',
  cnhIssuerUF: 'SP',
};

export const SAMPLE_VEHICLE: VehicleData = {
  plate: 'ABC1D23',
  renavam: '12345678910',
  brand: 'HONDA',
  model: 'CIVIC',
  city: 'SÃO PAULO',
  uf: 'SP',
  color: 'PRATA',
  ownerCpf: '123.456.789-09',
};
