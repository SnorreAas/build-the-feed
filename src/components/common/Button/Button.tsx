import { Link } from "react-router-dom";
import { buttonStyles } from "./style";

export enum ButtonVariant {
  FLAT = "flat",
  OUTLINED = "outlined",
  FILLED = "filled",
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
      className={`${buttonStyles.default} ${buttonStyles[variant]}`}
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
