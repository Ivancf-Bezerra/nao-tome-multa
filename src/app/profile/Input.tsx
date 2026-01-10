import { useState } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

// CORREÇÃO TÉCNICA:
// Omitimos 'onChange' do tipo nativo para evitar colisão de tipos (Event vs String)
interface InputProps extends Omit<TextInputProps, 'className' | 'onChange'> {
  label: string;
  value: string;
  onChange: (v: string) => void; // Agora o TS aceita que onChange receba string
  helperText?: string;
  errorText?: string;
}

export default function Input({
  label,
  value,
  onChange,
  helperText,
  errorText,
  onBlur,
  onFocus,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(errorText);

  const getBorderColor = () => {
    if (hasError) return 'border-amber-500';
    if (isFocused) return 'border-slate-500';
    return 'border-slate-700';
  };

  return (
    <View className="mt-4">
      <Text className="mb-1.5 text-xs font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </Text>

      <TextInput
        value={value}
        // MAPEAMENTO CORRETO:
        // O evento nativo 'onChangeText' retorna a string direta,
        // que repassamos para a sua prop 'onChange'.
        onChangeText={onChange}
        
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        
        className={`rounded-lg border bg-slate-800 px-4 py-3.5 text-sm text-white ${getBorderColor()}`}
        placeholderTextColor="#64748b"
        cursorColor="#fbbf24"
        {...rest}
      />

      {hasError ? (
        <View className="mt-1.5 flex-row items-center gap-1">
          <Text className="text-xs font-medium text-amber-500">
            {errorText}
          </Text>
        </View>
      ) : helperText ? (
        <Text className="mt-1.5 text-xs text-slate-500 leading-tight">
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}