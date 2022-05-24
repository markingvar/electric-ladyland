import { ReactNode } from "react";
import { Link } from "@remix-run/react";
// import styles from "~/styles/components/interactive/button.css";

// Button.styles = styles;

type ButtonProps = {
  variant?: "none" | "fill" | "outline" | "ghost";
  offset?: "none" | "left" | "right";
  size?: "small" | "medium" | "large";
  mood?: "default" | "success" | "info" | "alert" | "danger";
  type?: "link" | "submit" | "button";
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: any;
  elevation?: "sm" | "md" | "lg" | "xl";
  rel?: "nofollow";
  target?: "_blank";
  dataTest?: string;
};

export function Button({
  className,
  offset = "none",
  variant = "fill",
  size = "medium",
  mood,
  type,
  href,
  children,
  onClick,
  elevation,
  dataTest,
}: ButtonProps) {
  const buttonElevation = elevation;
  return type === "link" && href ? (
    <Link
      data-test={dataTest}
      prefetch="intent"
      className={`body-link remix-button${className ? " " + className : ""}${
        buttonElevation ? " elevation-" + buttonElevation : ""
      }`}
      to={href}
      data-offset={offset}
      data-size={size}
      data-mood={mood}
      data-variant={variant}
    >
      {children}
    </Link>
  ) : type === "submit" ? (
    <button
      data-test={dataTest}
      className={`body-link remix-button${className ? " " + className : ""}${
        buttonElevation ? " elevation-" + buttonElevation : ""
      } !border-none`}
      type="submit"
      data-offset={offset}
      data-size={size}
      data-mood={mood}
      data-variant={variant}
    >
      {children}
    </button>
  ) : type === "button" ? (
    <button
      data-test={dataTest}
      className={`${
        className ? "" + className : ""
      } body-link remix-button w-fit border-0 shadow-none${
        buttonElevation ? " elevation-" + buttonElevation : ""
      }`}
      onClick={onClick}
      data-size={size}
      data-variant={variant}
    >
      {children}
    </button>
  ) : (
    <a
      data-test={dataTest}
      className={`body-link remix-button${className ? " " + className : ""}${
        buttonElevation ? " elevation-" + buttonElevation : ""
      }`}
      data-offset={offset}
      href={href}
      data-size={size}
      data-mood={mood}
      data-variant={variant}
    >
      {children}
    </a>
  );
}
