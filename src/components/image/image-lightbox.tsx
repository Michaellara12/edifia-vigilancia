import Image from 'src/components/image/Image';

// ----------------------------------------------------------------------

type Props = {
  image: string;
  width?: number;
  height?: number;
};

export const ImageLightbox = ({ image, width = 160, height = 160 }: Props) => {
  const handleImageClick = () => {
    window.open(image, '_blank');
  };

  return (
    <>
      <Image
        alt="avatar"
        src={image}
        sx={{
          borderRadius: 2,
          width: width,
          height: height,
          cursor: 'pointer'
        }}
        onClick={handleImageClick}
      />
    </>
  );
};
