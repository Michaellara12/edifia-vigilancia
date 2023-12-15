import { Dispatch, SetStateAction } from 'react';
import { DropzoneOptions } from 'react-dropzone';
// @mui
import { SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface CameraProps extends DropzoneOptions {
  file: string | undefined;
  setFile: Dispatch<SetStateAction<string | undefined>>;
  error?: boolean;
  sx?: SxProps<Theme>;
  thumbnail?: boolean;
  placeholder?: React.ReactNode;
  helperText?: React.ReactNode;
  disableMultiple?: boolean;
  //
  onDelete?: VoidFunction;
  //
  files?: FileObject[];
  onUpload?: VoidFunction;
  onRemove?: (file: CustomFile | string) => void;
  onRemoveAll?: VoidFunction;
  isIdPicture?: boolean
}

export interface FileObject {
  blob: File;
  state: string;
}
