import { Link } from "react-router-dom";
import { buttonFlat, buttonOutlined, buttonStyle } from "./style";

export enum ButtonVariant {
  FLAT = "flat",
  OUTLINED = "outlined",
}

interface ButtonProps {
  variant: ButtonVariant;
  text: string;
  submit?: boolean;
  disabled?: boolean;
  route?: string;
  onClick?: () => void;
}

export const Button = ({
  variant,
  text,
  submit,
  disabled,
  route,
  onClick,
}: ButtonProps): JSX.Element => {
  const button = (
    <button
      type={submit ? "submit" : "button"}
      className={`${buttonStyle} ${
        variant === ButtonVariant.FLAT ? buttonFlat : buttonOutlined
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );

  if (route) {
    return (
      <Link className="m-auto" to={route}>
        {button}
      </Link>
    );
  }
  return button;
};
