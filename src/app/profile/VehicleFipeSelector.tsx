import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import Input from './Input';

const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

interface FipeBrand {
  codigo: string;
  nome: string;
}

interface FipeModel {
  codigo: number;
  nome: string;
}

export interface VehicleFipeData {
  brand: string;
  model: string;
}

export default function VehicleFipeSelector({
  value,
  onChange,
}: {
  value: VehicleFipeData;
  onChange: (v: VehicleFipeData) => void;
}) {
  const [brands, setBrands] = useState<FipeBrand[]>([]);
  const [models, setModels] = useState<FipeModel[]>([]);

  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [apiError, setApiError] = useState(false);

  const [brandQuery, setBrandQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');

  /* ===== MARCAS ===== */
  useEffect(() => {
    async function loadBrands() {
      setLoadingBrands(true);
      setApiError(false);

      try {
        const res = await fetch(`${FIPE_BASE_URL}/carros/marcas`);
        const json = await res.json();
        setBrands(json);
      } catch {
        setApiError(true);
      } finally {
        setLoadingBrands(false);
      }
    }

    loadBrands();
  }, []);

  /* ===== MODELOS (DEPENDE DA MARCA) ===== */
  useEffect(() => {
    if (!value.brand || apiError) return;

    async function loadModels() {
      setLoadingModels(true);

      try {
        const brand = brands.find(
          (b) => b.nome.toUpperCase() === value.brand,
        );

        if (!brand) return;

        const res = await fetch(
          `${FIPE_BASE_URL}/carros/marcas/${brand.codigo}/modelos`,
        );

        const json = await res.json();
        setModels(json.modelos);
      } catch {
        setApiError(true);
      } finally {
        setLoadingModels(false);
      }
    }

    loadModels();
  }, [value.brand, brands, apiError]);

  const filteredBrands = useMemo(() => {
    const q = brandQuery.trim().toUpperCase();
    if (!q) return brands;
    return brands.filter((b) =>
      b.nome.toUpperCase().includes(q),
    );
  }, [brandQuery, brands]);

  const filteredModels = useMemo(() => {
    const q = modelQuery.trim().toUpperCase();
    if (!q) return models;
    return models.filter((m) =>
      m.nome.toUpperCase().includes(q),
    );
  }, [modelQuery, models]);

  return (
    <View className="gap-6">
      <Text className="text-base font-semibold text-white">
        Identificação do veículo
      </Text>

      {/* MARCA */}
      <View>
        <Input
          label="Marca do veículo"
          value={value.brand}
          placeholder="Digite ou selecione"
          onChange={(v) => {
            setBrandQuery(v);
            onChange({ brand: v.toUpperCase(), model: '' });
          }}
          options={filteredBrands
            .slice(0, 10)
            .map((b) => b.nome.toUpperCase())}
          onSelectOption={(v) =>
            onChange({ brand: v, model: '' })
          }
          helperText={
            apiError
              ? 'Base FIPE indisponível. Preenchimento manual ativo.'
              : 'Base FIPE utilizada para reduzir erros.'
          }
        />

        {loadingBrands && (
          <ActivityIndicator className="mt-2" />
        )}
      </View>

      {/* MODELO */}
      <View>
        <Input
          label="Modelo do veículo"
          value={value.model}
          placeholder={
            value.brand
              ? 'Digite ou selecione'
              : 'Selecione a marca primeiro'
          }
          editable={Boolean(value.brand)}
          onChange={(v) => {
            setModelQuery(v);
            onChange({ ...value, model: v.toUpperCase() });
          }}
          options={filteredModels
            .slice(0, 10)
            .map((m) => m.nome.toUpperCase())}
          onSelectOption={(v) =>
            onChange({ ...value, model: v })
          }
        />

        {loadingModels && (
          <ActivityIndicator className="mt-2" />
        )}
      </View>
    </View>
  );
}
