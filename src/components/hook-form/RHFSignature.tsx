import { Dispatch, SetStateAction } from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import SignatureWidget from '../signature/signature-widget';
import { SignatureWidgetProps } from '../signature/types';

// ----------------------------------------------------------------------

interface ExtendedSignatureWidgetProps extends SignatureWidgetProps {
    name: string;
}

// ----------------------------------------------------------------------

export default function RHFSignature({ name, signature, setSignature }: ExtendedSignatureWidgetProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState: { error } }) => (
        <>
          <SignatureWidget signature={signature} setSignature={setSignature} />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </>
      )}
    />
  );
}