interface Props {
  children?: React.ReactNode;
}

export const Main = ({ children }: Props) => {
  return <div className="w-full mx-auto h-96">{children}</div>;
};
