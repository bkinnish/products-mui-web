import React from "react";
import "./validationError.css";

export interface ComponentProps {
  message?: String | undefined;
}

const ValidationError: React.FC<ComponentProps> = ({ message }) => {
  if (message === null || message === undefined) return null;

  return <small className="validationError">{message}</small>;
};

export default ValidationError;
