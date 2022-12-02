interface Props {
  img: string | undefined;
}

export const ImageBox = ({ img }: Props) => {
  if (!img) {
    return null;
  }
  return (
    <img
      src={img}
      alt={img.toString()}
      className="absolute top-0 left-0 right-0 bottom-0 md:rounded-t-md w-full h-full z-0"
    />
  );
};
