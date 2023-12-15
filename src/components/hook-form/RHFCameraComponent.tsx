import { Dispatch, SetStateAction } from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import CameraWidget from '../camera/camera-widget';
import { CameraProps } from 'src/components/camera/types';

// ----------------------------------------------------------------------

interface Props extends Omit<CameraProps, 'file'> {
  name: string;
  file: string | undefined;
  setFile: Dispatch<SetStateAction<string | undefined>>;
  isIdPicture?: boolean
}

// ----------------------------------------------------------------------

export default function RHFCameraComponent({ name, file, setFile, isIdPicture }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState: { error } }) => (
        <>
          <CameraWidget file={file} setFile={setFile} isIdPicture={isIdPicture}/>

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