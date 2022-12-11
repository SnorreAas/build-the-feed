import { useRouter } from "next/router";
import { Paths } from "../../../old-react/routes/routes";

export const Logo = (): JSX.Element => {
  const router = useRouter();
  return (
    <div
      className="my-auto py-2 cursor-pointer"
      onClick={() => router.replace(Paths.HOME)}
    >
      <div className="bg-black text-white py-1 px-2 text-2xl rounded-md">
        BTF
      </div>
    </div>
  );
};
