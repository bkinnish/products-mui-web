import * as React from "react";
import Button from "@mui/material/Button";

export interface ButtonProps {
  id?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Button type
   *  @default 'button'
   */
  type?: "button" | "submit" | "reset";
  /**
   * Button size
   *  @default 'small'
   */
  size?: "small" | "medium" | "large";
  visible?: boolean;
  kind?: "primary" | "secondary" | "tertiary";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const OutlinedButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  return (
    <Button {...props} variant="outlined">
      {props.children}
    </Button>
  );
};

export default OutlinedButton;
