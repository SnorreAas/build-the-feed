interface Props {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="max-w-7xl w-full mx-auto mt-[10px] p-2 grid lg:grid-cols-[240px,1fr,325px] md:grid-cols-[240px,1fr] grid-cols-[1fr] grid-rows-[1fr] gap-x-2">
      {children}
    </div>
  );
};
