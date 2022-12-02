interface Props {
  children?: React.ReactNode;
}

export const MainContainer = ({ children }: Props) => {
  return (
    <div className="bg-white shadow-outline rounded-md w-full mb-4 p-8">
      {children}
    </div>
  );
};
