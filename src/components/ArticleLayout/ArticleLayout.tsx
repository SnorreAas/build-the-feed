interface Props {
  children?: React.ReactNode;
}

export const ArticleLayout = ({ children }: Props) => {
  return (
    <div className="max-w-7xl w-full mx-auto md:mt-[10px] md:p-2 grid lg:grid-cols-[64px,7fr,minmax(270px,3fr)] md:grid-cols-[64px,1fr] grid-cols-[1fr] grid-rows-[1fr] gap-x-2">
      {children}
    </div>
  );
};
