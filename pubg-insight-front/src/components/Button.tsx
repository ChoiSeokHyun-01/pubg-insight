import React from "react";
import { useNavigate } from "react-router-dom";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  to: string;            // target URL or route
  replace?: boolean;     // history replace instead of push
};

export default function Button({ to, replace = false, children, onClick, ...rest }: ButtonProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // External absolute URLs -> full navigation
    if (/^https?:\/\//i.test(to)) {
      window.location.href = to;
      return;
    }

    // Internal route -> client-side navigation
    navigate(to, { replace });
  };

  return (
    <button {...rest} onClick={handleClick}>
      {children}
    </button>
  );
}
