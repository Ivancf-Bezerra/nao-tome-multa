import { createContext, useContext, useState, ReactNode } from 'react';

export type PlanUpgradeConfig = {
  /** Nome do recurso bloqueado, ex.: "Análise técnica de multas" */
  feature?: string;
  /** Plano mínimo necessário */
  requiredPlan?: 'starter' | 'monthly';
};

type PlanUpgradeContextData = {
  visible: boolean;
  config: PlanUpgradeConfig;
  showPlanUpgrade: (config?: PlanUpgradeConfig) => void;
  hidePlanUpgrade: () => void;
};

const PlanUpgradeContext = createContext<PlanUpgradeContextData | undefined>(undefined);

export function PlanUpgradeProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<PlanUpgradeConfig>({});

  function showPlanUpgrade(cfg?: PlanUpgradeConfig) {
    setConfig(cfg ?? {});
    setVisible(true);
  }

  function hidePlanUpgrade() {
    setVisible(false);
  }

  return (
    <PlanUpgradeContext.Provider value={{ visible, config, showPlanUpgrade, hidePlanUpgrade }}>
      {children}
    </PlanUpgradeContext.Provider>
  );
}

export function usePlanUpgrade(): PlanUpgradeContextData {
  const ctx = useContext(PlanUpgradeContext);
  if (!ctx) throw new Error('usePlanUpgrade must be used within a PlanUpgradeProvider');
  return ctx;
}
