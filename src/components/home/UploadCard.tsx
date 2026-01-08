import { Pressable, Text } from 'react-native';
import { useState } from 'react';
import UploadOptionsModal from './UploadOptionsModal';

export default function UploadCard() {
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="mb-6 rounded-3xl bg-[#fbbf24] px-6 py-7 active:opacity-90"
      >
        <Text className="text-lg font-semibold text-slate-900">
          Iniciar análise de infração
        </Text>

        <Text className="mt-3 text-sm leading-relaxed text-slate-800">
          Faça o upload do auto de infração para análise técnica local,
          sem envio automático a órgãos externos.
        </Text>
      </Pressable>

      <UploadOptionsModal
        visible={open}
        onClose={handleClose}
      />
    </>
  );
}
