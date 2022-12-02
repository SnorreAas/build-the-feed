import { useNavigate } from "react-router-dom";
import { Paths } from "../../../routes/routes";

export const Logo = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div
      className="my-auto py-2 cursor-pointer"
      onClick={() => navigate(Paths.HOME)}
    >
      <div className="bg-black text-white py-1 px-2 text-2xl rounded-md">
        BTF
      </div>
    </div>
  );
};
