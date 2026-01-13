import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * CORREÇÃO TÉCNICA:
 * - Omitimos 'onChange' do tipo nativo para evitar colisão (Event vs string)
 * - Usamos onChangeText para trabalhar apenas com string
 * - NÃO usamos FlatList para evitar conflito com ScrollView pai
 */
interface InputProps
  extends Omit<TextInputProps, 'className' | 'onChange'> {
  label: string;
  value: string;
  onChange: (v: string) => void;

  helperText?: string;
  errorText?: string;

  /** Dropdown */
  options?: string[];
  onSelectOption?: (v: string) => void;

  /** Ícone à direita */
  rightIcon?: keyof typeof Ionicons.glyphMap;
}

export default function Input({
  label,
  value,
  onChange,
  helperText,
  errorText,
  onBlur,
  onFocus,
  options,
  onSelectOption,
  rightIcon = 'chevron-down',
  editable = true,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);

  const hasError = Boolean(errorText);
  const hasDropdown = Boolean(options && options.length);

  const getBorderColor = () => {
    if (hasError) return 'border-amber-500';
    if (isFocused) return 'border-slate-500';
    return 'border-slate-700';
  };

  return (
    <View className="mt-4">
      {/* LABEL */}
      <Text className="mb-1.5 text-xs font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </Text>

      {/* INPUT + ÍCONE */}
      <View
        className={`flex-row items-center rounded-lg border bg-slate-800 px-4 ${getBorderColor()}`}
      >
        <TextInput
          value={value}
          editable={editable}
          onChangeText={(v) => {
            onChange(v);
            if (hasDropdown) setOpen(true);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className="flex-1 py-3.5 text-sm text-white"
          placeholderTextColor="#64748b"
          cursorColor="#fbbf24"
          {...rest}
        />

        {hasDropdown && (
          <Pressable
            onPress={() => setOpen((prev) => !prev)}
            hitSlop={10}
            className="ml-2"
          >
            <Ionicons
              name={rightIcon}
              size={18}
              color="#94a3b8"
            />
          </Pressable>
        )}
      </View>

      {/* DROPDOWN (SEM FlatList) */}
      {hasDropdown && open && (
        <View className="mt-1 max-h-48 rounded-lg border border-slate-700 bg-slate-800">
          <ScrollView
            keyboardShouldPersistTaps="handled"
          >
            {options!.map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  onSelectOption?.(item);
                  setOpen(false);
                }}
                className="px-4 py-3 border-b border-slate-700"
              >
                <Text className="text-sm text-white">
                  {item}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* FEEDBACK */}
      {hasError ? (
        <View className="mt-1.5">
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
