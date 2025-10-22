"use client";

import React, {
  forwardRef,
  useEffect,
  useState,
  ReactElement,
  JSXElementConstructor,
  useContext,
} from "react";

const LoadingSpinnerSVG = () => (
  <svg
    className="animate-spin h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const Plus = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const X = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const Check = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const Danger = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    role="img"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12" y2="16" />
  </svg>
);

const cn = (...classes: Array<string | boolean | undefined | null>): string => {
  return classes.filter(Boolean).join(" ");
};

const isIconDualSource = (icon: any): icon is IconDualSource => {
  return (
    typeof icon === "object" &&
    icon !== null &&
    ("light" in icon || "dark" in icon)
  );
};

const isOptimizedImageProps = (source: any): source is OptimizedImageProps => {
  return (
    typeof source === "object" &&
    source !== null &&
    "src" in source &&
    typeof source.src === "string"
  );
};

interface OptimizedImageProps {
  src: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

type NonElementIconSource = string | OptimizedImageProps;

interface IconDualSource {
  light: NonElementIconSource;
  dark: NonElementIconSource;
}

type IconProp = NonElementIconSource | IconDualSource | React.ReactNode;

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "simple"
  | "neutral"
  | "disabled";

type ButtonShape = "square" | "squircle" | "circle";

type ButtonSize = "sm" | "md" | "lg" | "xl";

type ButtonColor =
  | "orange"
  | "red"
  | "white"
  | "black"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone";

type ButtonType = "default" | "error" | "add" | "accept" | "danger";

interface CommonProps {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  loading?: boolean;
  icon?: IconProp;
  iconPosition?: "left" | "right" | "top" | "bottom";
  color?: ButtonColor;
  className?: string;
  children: React.ReactNode;
  iconSize?: ButtonSize;
  alt?: string;
  disabled?: boolean;
  size?: ButtonSize;
  type?: ButtonType;
}

interface ButtonAsButtonProps
  extends CommonProps,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "onClick" | "children" | "disabled" | "color" | "type"
    > {
  href?: never;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface ButtonAsAnchorProps
  extends CommonProps,
    Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      "onClick" | "children" | "color" | "type"
    > {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

const ringOffset = "ring-offset-2";
const baseStyles =
  "inline-flex items-center justify-center transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none font-medium";
const disabledStyles = "opacity-50 pointer-events-none";

const simpleStyles =
  "bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-white/60 text-white dark:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white";
const neutralStyles =
  "bg-gray-500 dark:bg-gray-500/40 hover:bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-700";

const shapeStyles: Record<ButtonShape, string> = {
  squircle: "rounded-xl",
  square: "rounded-lg",
  circle: "rounded-full px-2 py-2 min-w-[32px] min-h-[32px]",
};

const buttonSizeStyles: Record<ButtonSize, string> = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-md",
  lg: "px-4 py-3 text-lg",
  xl: "px-4 py-3 text-xl",
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
};

const iconImageSizeStyles: Record<ButtonSize, string> = {
  sm: "h-4 w-auto object-contain",
  md: "h-5 w-auto object-contain",
  lg: "h-6 w-auto object-contain",
  xl: "h-7 w-auto object-contain",
};

type ColorMap = Record<
  Exclude<ButtonColor, "white" | "black" | "neutral">,
  Record<Exclude<ButtonVariant, "simple" | "neutral" | "disabled">, string>
>;

const colorVariantMap: ColorMap = {
  orange: {
    primary: `bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/30 dark:bg-orange-500 dark:hover:bg-orange-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-orange-500`,
    secondary: `bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-orange-900 dark:hover:bg-orange-800 dark:text-orange-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-orange-500`,
    outline: `bg-transparent ring-2 ring-inset ring-orange-600 text-orange-600 hover:bg-orange-100 dark:ring-orange-400 dark:text-orange-400 dark:hover:bg-orange-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-orange-500`,
    ghost: `bg-transparent hover:bg-orange-600/20 text-orange-600 hover:text-orange-700 dark:hover:bg-orange-500/20 dark:text-orange-400 dark:hover:text-orange-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-orange-500`,
    link: `text-orange-600 hover:underline dark:text-orange-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-orange-500`,
  },
  red: {
    primary: `bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-red-500`,
    secondary: `bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-red-500`,
    outline: `bg-transparent ring-2 ring-inset ring-red-600 text-red-600 hover:bg-red-100 dark:ring-red-400 dark:text-red-400 dark:hover:bg-red-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-red-500`,
    ghost: `bg-transparent hover:bg-red-600/20 text-red-600 hover:text-red-700 dark:hover:bg-red-500/20 dark:text-red-400 dark:hover:text-red-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-red-500`,
    link: `text-red-600 hover:underline dark:text-red-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-red-500`,
  },
  amber: {
    primary: `bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/30 dark:bg-amber-500 dark:hover:bg-amber-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-amber-500`,
    secondary: `bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900 dark:hover:bg-amber-800 dark:text-amber-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-amber-500`,
    outline: `bg-transparent ring-2 ring-inset ring-amber-600 text-amber-600 hover:bg-amber-100 dark:ring-amber-400 dark:text-amber-400 dark:hover:bg-amber-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-amber-500`,
    ghost: `bg-transparent hover:bg-amber-600/20 text-amber-600 hover:text-amber-700 dark:hover:bg-amber-500/20 dark:text-amber-400 dark:hover:text-amber-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-amber-500`,
    link: `text-amber-600 hover:underline dark:text-amber-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-amber-500`,
  },
  yellow: {
    primary: `bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-600/30 dark:bg-yellow-500 dark:hover:bg-yellow-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-yellow-500`,
    secondary: `bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:hover:bg-yellow-800 dark:text-yellow-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-yellow-500`,
    outline: `bg-transparent ring-2 ring-inset ring-yellow-600 text-yellow-600 hover:bg-yellow-100 dark:ring-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-yellow-500`,
    ghost: `bg-transparent hover:bg-yellow-600/20 text-yellow-600 hover:text-yellow-700 dark:hover:bg-yellow-500/20 dark:text-yellow-400 dark:hover:text-yellow-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-yellow-500`,
    link: `text-yellow-600 hover:underline dark:text-yellow-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-yellow-500`,
  },
  lime: {
    primary: `bg-lime-600 hover:bg-lime-700 text-white shadow-lg shadow-lime-600/30 dark:bg-lime-500 dark:hover:bg-lime-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-lime-500`,
    secondary: `bg-lime-100 hover:bg-lime-200 text-lime-800 dark:bg-lime-900 dark:hover:bg-lime-800 dark:text-lime-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-lime-500`,
    outline: `bg-transparent ring-2 ring-inset ring-lime-600 text-lime-600 hover:bg-lime-100 dark:ring-lime-400 dark:text-lime-400 dark:hover:bg-lime-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-lime-500`,
    ghost: `bg-transparent hover:bg-lime-600/20 text-lime-600 hover:text-lime-700 dark:hover:bg-lime-500/20 dark:text-lime-400 dark:hover:text-lime-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-lime-500`,
    link: `text-lime-600 hover:underline dark:text-lime-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-lime-500`,
  },
  green: {
    primary: `bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-green-500`,
    secondary: `bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-green-500`,
    outline: `bg-transparent ring-2 ring-inset ring-green-600 text-green-600 hover:bg-green-100 dark:ring-green-400 dark:text-green-400 dark:hover:bg-green-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-green-500`,
    ghost: `bg-transparent hover:bg-green-600/20 text-green-600 hover:text-green-700 dark:hover:bg-green-500/20 dark:text-green-400 dark:hover:text-green-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-green-500`,
    link: `text-green-600 hover:underline dark:text-green-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-green-500`,
  },
  emerald: {
    primary: `bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 dark:bg-emerald-500 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-emerald-500`,
    secondary: `bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:hover:bg-emerald-800 dark:text-emerald-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-emerald-500`,
    outline: `bg-transparent ring-2 ring-inset ring-emerald-600 text-emerald-600 hover:bg-emerald-100 dark:ring-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-emerald-500`,
    ghost: `bg-transparent hover:bg-emerald-600/20 text-emerald-600 hover:text-emerald-700 dark:hover:bg-emerald-500/20 dark:text-emerald-400 dark:hover:text-emerald-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-emerald-500`,
    link: `text-emerald-600 hover:underline dark:text-emerald-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-emerald-500`,
  },
  teal: {
    primary: `bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30 dark:bg-teal-500 dark:hover:bg-teal-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-teal-500`,
    secondary: `bg-teal-100 hover:bg-teal-200 text-teal-800 dark:bg-teal-900 dark:hover:bg-teal-800 dark:text-teal-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-teal-500`,
    outline: `bg-transparent ring-2 ring-inset ring-teal-600 text-teal-600 hover:bg-teal-100 dark:ring-teal-400 dark:text-teal-400 dark:hover:bg-teal-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-teal-500`,
    ghost: `bg-transparent hover:bg-teal-600/20 text-teal-600 hover:text-teal-700 dark:hover:bg-teal-500/20 dark:text-teal-400 dark:hover:text-teal-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-teal-500`,
    link: `text-teal-600 hover:underline dark:text-teal-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-teal-500`,
  },
  cyan: {
    primary: `bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-600/30 dark:bg-cyan-500 dark:hover:bg-cyan-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-cyan-500`,
    secondary: `bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:bg-cyan-900 dark:hover:bg-cyan-800 dark:text-cyan-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-cyan-500`,
    outline: `bg-transparent ring-2 ring-inset ring-cyan-600 text-cyan-600 hover:bg-cyan-100 dark:ring-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-cyan-500`,
    ghost: `bg-transparent hover:bg-cyan-600/20 text-cyan-600 hover:text-cyan-700 dark:hover:bg-cyan-500/20 dark:text-cyan-400 dark:hover:text-cyan-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-cyan-500`,
    link: `text-cyan-600 hover:underline dark:text-cyan-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-cyan-500`,
  },
  sky: {
    primary: `bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/30 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-sky-500`,
    secondary: `bg-sky-100 hover:bg-sky-200 text-sky-800 dark:bg-sky-900 dark:hover:bg-sky-800 dark:text-sky-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-sky-500`,
    outline: `bg-transparent ring-2 ring-inset ring-sky-600 text-sky-600 hover:bg-sky-100 dark:ring-sky-400 dark:text-sky-400 dark:hover:bg-sky-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-sky-500`,
    ghost: `bg-transparent hover:bg-sky-600/20 text-sky-600 hover:text-sky-700 dark:hover:bg-sky-500/20 dark:text-sky-400 dark:hover:text-sky-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-sky-500`,
    link: `text-sky-600 hover:underline dark:text-sky-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-sky-500`,
  },
  blue: {
    primary: `bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-blue-500`,
    secondary: `bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-blue-500`,
    outline: `bg-transparent ring-2 ring-inset ring-blue-600 text-blue-600 hover:bg-blue-100 dark:ring-blue-400 dark:text-blue-400 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-blue-500`,
    ghost: `bg-transparent hover:bg-blue-600/20 text-blue-600 hover:text-blue-700 dark:hover:bg-blue-500/20 dark:text-blue-400 dark:hover:text-blue-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-blue-500`,
    link: `text-blue-600 hover:underline dark:text-blue-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-blue-500`,
  },
  indigo: {
    primary: `bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-indigo-500`,
    secondary: `bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-indigo-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-indigo-500`,
    outline: `bg-transparent ring-2 ring-inset ring-indigo-600 text-indigo-600 hover:bg-indigo-100 dark:ring-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-indigo-500`,
    ghost: `bg-transparent hover:bg-indigo-600/20 text-indigo-600 hover:text-indigo-700 dark:hover:bg-indigo-500/20 dark:text-indigo-400 dark:hover:text-indigo-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-indigo-500`,
    link: `text-indigo-600 hover:underline dark:text-indigo-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-indigo-500`,
  },
  violet: {
    primary: `bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/30 dark:bg-violet-500 dark:hover:bg-violet-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-violet-500`,
    secondary: `bg-violet-100 hover:bg-violet-200 text-violet-800 dark:bg-violet-900 dark:hover:bg-violet-800 dark:text-violet-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-violet-500`,
    outline: `bg-transparent ring-2 ring-inset ring-violet-600 text-violet-600 hover:bg-violet-100 dark:ring-violet-400 dark:text-violet-400 dark:hover:bg-violet-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-violet-500`,
    ghost: `bg-transparent hover:bg-violet-600/20 text-violet-600 hover:text-violet-700 dark:hover:bg-violet-500/20 dark:text-violet-400 dark:hover:text-violet-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-violet-500`,
    link: `text-violet-600 hover:underline dark:text-violet-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-violet-500`,
  },
  purple: {
    primary: `bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30 dark:bg-purple-500 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-purple-500`,
    secondary: `bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-purple-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-purple-500`,
    outline: `bg-transparent ring-2 ring-inset ring-purple-600 text-purple-600 hover:bg-purple-100 dark:ring-purple-400 dark:text-purple-400 dark:hover:bg-purple-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-purple-500`,
    ghost: `bg-transparent hover:bg-purple-600/20 text-purple-600 hover:text-purple-700 dark:hover:bg-purple-500/20 dark:text-purple-400 dark:hover:text-purple-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-purple-500`,
    link: `text-purple-600 hover:underline dark:text-purple-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-purple-500`,
  },
  fuchsia: {
    primary: `bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-lg shadow-fuchsia-600/30 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-fuchsia-500`,
    secondary: `bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 dark:bg-fuchsia-900 dark:hover:bg-fuchsia-800 dark:text-fuchsia-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-fuchsia-500`,
    outline: `bg-transparent ring-2 ring-inset ring-fuchsia-600 text-fuchsia-600 hover:bg-fuchsia-100 dark:ring-fuchsia-400 dark:text-fuchsia-400 dark:hover:bg-fuchsia-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-fuchsia-500`,
    ghost: `bg-transparent hover:bg-fuchsia-600/20 text-fuchsia-600 hover:text-fuchsia-700 dark:hover:bg-fuchsia-500/20 dark:text-fuchsia-400 dark:hover:text-fuchsia-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-fuchsia-500`,
    link: `text-fuchsia-600 hover:underline dark:text-fuchsia-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-fuchsia-500`,
  },
  pink: {
    primary: `bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-600/30 dark:bg-pink-500 dark:hover:bg-pink-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-pink-500`,
    secondary: `bg-pink-100 hover:bg-pink-200 text-pink-800 dark:bg-pink-900 dark:hover:bg-pink-800 dark:text-pink-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-pink-500`,
    outline: `bg-transparent ring-2 ring-inset ring-pink-600 text-pink-600 hover:bg-pink-100 dark:ring-pink-400 dark:text-pink-400 dark:hover:bg-pink-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-pink-500`,
    ghost: `bg-transparent hover:bg-pink-600/20 text-pink-600 hover:text-pink-700 dark:hover:bg-pink-500/20 dark:text-pink-400 dark:hover:text-pink-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-pink-500`,
    link: `text-pink-600 hover:underline dark:text-pink-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-pink-500`,
  },
  rose: {
    primary: `bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 dark:bg-rose-500 dark:hover:bg-rose-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-rose-500`,
    secondary: `bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-900 dark:hover:bg-rose-800 dark:text-rose-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-rose-500`,
    outline: `bg-transparent ring-2 ring-inset ring-rose-600 text-rose-600 hover:bg-rose-100 dark:ring-rose-400 dark:text-rose-400 dark:hover:bg-rose-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-rose-500`,
    ghost: `bg-transparent hover:bg-rose-600/20 text-rose-600 hover:text-rose-700 dark:hover:bg-rose-500/20 dark:text-rose-400 dark:hover:text-rose-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-rose-500`,
    link: `text-rose-600 hover:underline dark:text-rose-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-rose-500`,
  },
  slate: {
    primary: `bg-slate-600 hover:bg-slate-700 text-white shadow-lg shadow-slate-600/30 dark:bg-slate-500 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-slate-500`,
    secondary: `bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-slate-500`,
    outline: `bg-transparent ring-2 ring-inset ring-slate-600 text-slate-600 hover:bg-slate-100 dark:ring-slate-400 dark:text-slate-400 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-slate-500`,
    ghost: `bg-transparent hover:bg-slate-600/20 text-slate-600 hover:text-slate-700 dark:hover:bg-slate-500/20 dark:text-slate-400 dark:hover:text-slate-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-slate-500`,
    link: `text-slate-600 hover:underline dark:text-slate-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-slate-500`,
  },
  gray: {
    primary: `bg-gray-600 hover:bg-gray-700 text-white shadow-lg shadow-gray-600/30 dark:bg-gray-500 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-gray-500`,
    secondary: `bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-gray-500`,
    outline: `bg-transparent ring-2 ring-inset ring-gray-600 text-gray-600 hover:bg-gray-100 dark:ring-gray-400 dark:text-gray-400 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-gray-500`,
    ghost: `bg-transparent hover:bg-gray-600/20 text-gray-600 hover:text-gray-700 dark:hover:bg-gray-500/20 dark:text-gray-400 dark:hover:text-gray-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-gray-500`,
    link: `text-gray-600 hover:underline dark:text-gray-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-gray-500`,
  },
  zinc: {
    primary: `bg-zinc-600 hover:bg-zinc-700 text-white shadow-lg shadow-zinc-600/30 dark:bg-zinc-500 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-zinc-500`,
    secondary: `bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-zinc-500`,
    outline: `bg-transparent ring-2 ring-inset ring-zinc-600 text-zinc-600 hover:bg-zinc-100 dark:ring-zinc-400 dark:text-zinc-400 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-zinc-500`,
    ghost: `bg-transparent hover:bg-zinc-600/20 text-zinc-600 hover:text-zinc-700 dark:hover:bg-zinc-500/20 dark:text-zinc-400 dark:hover:text-zinc-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-zinc-500`,
    link: `text-zinc-600 hover:underline dark:text-zinc-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-zinc-500`,
  },
  stone: {
    primary: `bg-stone-600 hover:bg-stone-700 text-white shadow-lg shadow-stone-600/30 dark:bg-stone-500 dark:hover:bg-stone-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-stone-500`,
    secondary: `bg-stone-100 hover:bg-stone-200 text-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-stone-500`,
    outline: `bg-transparent ring-2 ring-inset ring-stone-600 text-stone-600 hover:bg-stone-100 dark:ring-stone-400 dark:text-stone-400 dark:hover:bg-stone-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-stone-500`,
    ghost: `bg-transparent hover:bg-stone-600/20 text-stone-600 hover:text-stone-700 dark:hover:bg-stone-500/20 dark:text-stone-400 dark:hover:text-stone-600 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-stone-500`,
    link: `text-stone-600 hover:underline dark:text-stone-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-stone-500`,
  },
};

const getVariantClasses = (
  color: Exclude<ButtonColor, "neutral">,
  variant: Exclude<ButtonVariant, "simple" | "neutral" | "disabled">
): string => {
  if (color === "white") {
    switch (variant) {
      case "primary":
        return "bg-white/90 hover:bg-white/100 text-black shadow-lg shadow-white/20 dark:bg-white/50 dark:hover:bg-white/60 focus:ring-white/50";
      case "secondary":
        return "bg-white/10 hover:bg-white/20 text-white/80 dark:bg-white/20 dark:hover:bg-white/30 dark:text-white/90 focus:ring-white/50";
      case "outline":
        return "bg-transparent ring-2 ring-inset ring-white/60 text-white hover:bg-white/10 dark:ring-white/40 dark:text-white/80 dark:hover:bg-white/10 focus:ring-white/50";
      case "ghost":
        return "bg-transparent hover:bg-white/10 text-white/70 hover:text-white dark:hover:bg-white/20 dark:text-white/60 focus:ring-white/50";
      case "link":
        return "text-white/60 hover:underline dark:text-white/80";
      default:
        return "";
    }
  }

  if (color === "black") {
    switch (variant) {
      case "primary":
        return "bg-gray-900 hover:bg-black text-white shadow-lg shadow-black/20 dark:bg-gray-800 dark:hover:bg-gray-900 focus:ring-black/50";
      case "secondary":
        return "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 focus:ring-black/50";
      case "outline":
        return "bg-transparent ring-2 ring-inset ring-gray-700 text-gray-800 hover:bg-gray-100 dark:ring-gray-300 dark:text-gray-200 dark:hover:bg-gray-900 focus:ring-black/50";
      case "ghost":
        return "bg-transparent hover:bg-gray-200 text-gray-800 hover:text-black dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white focus:ring-black/50";
      case "link":
        return "text-gray-800 hover:underline dark:text-gray-300";
      default:
        return "";
    }
  }

  if (colorVariantMap[color] && colorVariantMap[color][variant]) {
    return colorVariantMap[color][variant];
  }

  return "";
};

const getIntentClasses = (
  type: Exclude<ButtonType, "default">,
  variant: Exclude<ButtonVariant, "simple" | "neutral" | "disabled">
): string => {
  const mappedColor: ButtonColor =
    type === "error" || type === "danger" ? "red" : "emerald";
  return getVariantClasses(mappedColor, variant);
};

interface ButtonGroupContextProps {
  isGrouped: boolean;
  groupPosition: "first" | "middle" | "last" | "single" | null;
}

const ButtonGroupContext = React.createContext<ButtonGroupContextProps>({
  isGrouped: false,
  groupPosition: null,
});

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = "",
  ...rest
}) => {
  const buttons = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Button
  );

  if (buttons.length === 0) return null;

  return (
    <div
      className={cn(
        "inline-flex rounded-xl shadow-md overflow-hidden",
        className
      )}
      role="group"
      {...rest}
    >
      {buttons.map((child, index) => {
        let groupPosition: ButtonGroupContextProps["groupPosition"] = "middle";
        if (buttons.length === 1) {
          groupPosition = "single";
        } else if (index === 0) {
          groupPosition = "first";
        } else if (index === buttons.length - 1) {
          groupPosition = "last";
        }

        const contextValue: ButtonGroupContextProps = {
          isGrouped: true,
          groupPosition: groupPosition,
        };

        return (
          <ButtonGroupContext.Provider key={index} value={contextValue}>
            {child}
          </ButtonGroupContext.Provider>
        );
      })}
    </div>
  );
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = "primary",
      shape = "squircle",
      loading = false,
      icon,
      iconPosition = "left",
      color = "blue",
      children,
      disabled = false,
      className = "",
      onClick,
      iconSize = "md",
      alt,
      size = "md",
      href,
      type = "default",
      ...rest
    } = props;

    const { isGrouped, groupPosition } = useContext(ButtonGroupContext);

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
      if (typeof document === "undefined") return;

      const checkDarkMode = () => {
        setDarkMode(document.documentElement.classList.contains("dark"));
      };

      checkDarkMode();

      const targetNode = document.documentElement;
      const config = { attributes: true, attributeFilter: ["class"] };

      const callback = (mutationsList: Array<MutationRecord>) => {
        for (const mutation of mutationsList) {
          if (mutation.attributeName === "class") {
            checkDarkMode();
            return;
          }
        }
      };

      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);

      return () => observer.disconnect();
    }, []);

    const buttonSizeClass = buttonSizeStyles[size] || buttonSizeStyles.md;

    const isDisabled = disabled || loading;
    let variantClass = "";

    if (isDisabled) {
      variantClass = disabledStyles;
    } else if (type === "error" || type === "add" || type === "danger") {
      variantClass = getIntentClasses(
        type,
        variant as Exclude<ButtonVariant, "simple" | "neutral" | "disabled">
      );
    } else if (variant === "simple") {
      variantClass = simpleStyles;
    } else if (variant === "neutral") {
      variantClass = neutralStyles;
    } else {
      variantClass = getVariantClasses(
        color as Exclude<ButtonColor, "neutral">,
        variant as Exclude<ButtonVariant, "simple" | "neutral" | "disabled">
      );
    }

    let shapeClass = shapeStyles[shape];
    let variantShapeClass = "";

    const isFullyRounded =
      groupPosition === "single" || variant === "ghost" || variant === "link";

    if (isFullyRounded) {
      if (shape === "circle") {
        variantShapeClass = "rounded-full";
      } else if (shape === "squircle") {
        variantShapeClass = "rounded-xl";
      } else if (shape === "square") {
        variantShapeClass = "rounded-lg";
      }
    } else {
      switch (groupPosition) {
        case "first":
          if (shape === "circle") {
            variantShapeClass = "rounded-l-full";
          } else if (shape === "squircle") {
            variantShapeClass = "rounded-l-xl";
          } else if (shape === "square") {
            variantShapeClass = "rounded-l-lg";
          }
          break;

        case "middle":
          variantShapeClass = "rounded-none";
          break;

        case "last":
          if (shape === "circle") {
            variantShapeClass = "rounded-r-full";
          } else if (shape === "squircle") {
            variantShapeClass = "rounded-r-xl";
          } else if (shape === "square") {
            variantShapeClass = "rounded-r-lg";
          }
          break;

        default:
          variantShapeClass = "";
          break;
      }
    }

    if (isGrouped) {
      shapeClass = cn(
        groupPosition !== "last" &&
          "border-r border-white/40 dark:border-black/30",
        variantShapeClass
      );
      variantClass = variantClass
        .replace(/shadow-lg/, "")
        .replace(/shadow-\w+-\d+\/\d+/, "");
    } else {
      shapeClass = shapeStyles[shape];
    }

    const finalClassName = cn(
      baseStyles,
      variantClass,
      shapeClass,
      className,
      buttonSizeClass,
      isDisabled && disabledStyles
    );

    const renderIcon = (): React.ReactNode => {
      if (!icon) return null;

      let currentIcon: IconProp = icon;

      if (isIconDualSource(currentIcon)) {
        if (darkMode && currentIcon.dark) {
          currentIcon = currentIcon.dark;
        } else if (currentIcon.light) {
          currentIcon = currentIcon.light;
        } else {
          currentIcon = currentIcon.light || currentIcon.dark;
        }
      }

      if (!currentIcon) return null;

      const sizeClass = iconSizeStyles[iconSize] || iconSizeStyles.md;
      const imageSizeClass =
        iconImageSizeStyles[iconSize] || iconImageSizeStyles.md;

      const imageSrc = isOptimizedImageProps(currentIcon)
        ? currentIcon.src
        : typeof currentIcon === "string"
        ? currentIcon
        : undefined;

      if (imageSrc) {
        return (
          <img
            src={imageSrc}
            alt={alt || "Button icon"}
            className={imageSizeClass}
          />
        );
      }

      if (React.isValidElement(currentIcon)) {
        const iconElement = currentIcon as ReactElement<
          { className?: string }, // Specify that it has a className prop
          string | JSXElementConstructor<any>
        >;
        return React.cloneElement(iconElement, {
          className: cn(iconElement.props.className, sizeClass),
        });
      }

      if (typeof currentIcon === "string" || typeof currentIcon === "number") {
        return <span className={sizeClass}>{currentIcon}</span>;
      }

      return currentIcon as React.ReactNode;
    };

    const renderContent = () => {
      if (loading) {
        return <LoadingSpinnerSVG />;
      }

      const explicitIconElement = renderIcon();

      let implicitIcon: React.ReactNode = null;

      if (!explicitIconElement) {
        const sizeClass = iconSizeStyles[iconSize] || iconSizeStyles.md;

        switch (type) {
          case "add":
            implicitIcon = <Plus className={sizeClass} />;
            break;
          case "error":
            implicitIcon = <X className={sizeClass} />;
            break;
          case "accept":
            implicitIcon = <Check className={sizeClass} />;
            break;
          case "danger":
            implicitIcon = <Danger className={sizeClass} />;
            break;
          default:
            break;
        }
      }

      const finalIconElement = explicitIconElement || implicitIcon;

      const directionClass =
        iconPosition === "top" || iconPosition === "bottom"
          ? "flex-col"
          : "flex-row";

      const gapClass = finalIconElement && children ? "gap-2" : "";

      const content = (
        <div
          className={cn(
            "flex items-center justify-center",
            directionClass,
            gapClass
          )}
        >
          {finalIconElement &&
            (iconPosition === "left" || iconPosition === "top") &&
            finalIconElement}
          {children}
          {finalIconElement &&
            (iconPosition === "right" || iconPosition === "bottom") &&
            finalIconElement}
        </div>
      );

      return content;
    };

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={finalClassName}
          target="_blank"
          rel="noopener noreferrer"
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {renderContent()}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={finalClassName}
        disabled={isDisabled}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, ButtonGroup };
