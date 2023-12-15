import Image from 'src/components/image/Image';
import { CustomFile } from './types';

// ----------------------------------------------------------------------

type Props = {
  file: CustomFile | string | null;
};

export default function CameraPhotoPreview({ file }: Props) {
  if (!file) {
    return null;
  }

  const imgUrl = typeof file === 'string' ? file : file.preview;

  return (
    <Image
      alt="avatar"
      src={imgUrl}
      sx={{
        zIndex: 8,
        overflow: 'hidden',
        borderRadius: '10%',
        position: 'absolute',
        width: `calc(100% - 16px)`,
        height: `calc(100% - 16px)`,
      }}
    />
  );
}
