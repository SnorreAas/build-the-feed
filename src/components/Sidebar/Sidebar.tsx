interface Props {
  children?: React.ReactNode;
}

export const Sidebar = ({ children }: Props) => {
  return <div className="w-full">{children}</div>;
};
