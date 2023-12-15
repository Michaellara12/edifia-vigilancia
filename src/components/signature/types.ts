import { 
  Dispatch, 
  SetStateAction, 
  RefObject 
} from 'react';
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
}

export interface FileObject {
  blob: File;
  state: string;
}

export type Draw = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
  prevPoint: Point | null
}

export type Point = { x: number; y: number, pressure: number }

// ----------------------------------------------------------------------

export type SignatureDialogProps = {
  open: boolean
  handleClose: () => void
  setSignature: Dispatch<SetStateAction<string | null>>
}

// ----------------------------------------------------------------------

export type SignatureCanvasProps = {
  strokes: Point[][] | []
  setStrokes: Dispatch<SetStateAction<Point[][]>>
  svgRef: RefObject<SVGSVGElement>
}

// ----------------------------------------------------------------------

export type SignatureWidgetProps = {
  signature: string | null
  setSignature: Dispatch<SetStateAction<string | null>>
}
