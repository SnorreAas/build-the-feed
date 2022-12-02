interface Props {
  children?: React.ReactNode;
}

export const SidebarContainer = ({ children }: Props) => {
  return (
    <div className="bg-white shadow-outline rounded-md w-full mb-4 p-4">
      {children}
    </div>
  );
};
