interface Props {
  children?: React.ReactNode;
}

export const MainContainer = ({ children }: Props) => {
  return (
    <div className="bg-container-light dark:bg-container-dark shadow-outline rounded-md w-full mb-4 py-8 md:px-12 px-6">
      {children}
    </div>
  );
};
