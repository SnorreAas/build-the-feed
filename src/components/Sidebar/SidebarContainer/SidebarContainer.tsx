interface Props {
  children?: React.ReactNode;
}

export const SidebarContainer = ({ children }: Props) => {
  return (
    <div className="bg-container-light dark:bg-container-dark shadow-outline rounded-md w-full mb-4 p-4">
      {children}
    </div>
  );
};
