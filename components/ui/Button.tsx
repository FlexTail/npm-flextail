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
  iconSize?: number;
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

  const mainShade = "600";
  const hoverShade = "700";
  const darkMainShade = "500";
  const darkHoverShade = "600";
  const focusShade = "500";
  const ringOffset = "ring-offset-2";

  switch (variant) {
    case "primary":
      return `bg-${color}-${mainShade} hover:bg-${color}-${hoverShade} text-white shadow-lg shadow-${color}-${mainShade}/30 dark:bg-${color}-${darkMainShade} dark:hover:bg-${color}-${darkHoverShade} focus:outline-none focus:ring-2 ${ringOffset} focus:ring-${color}-${focusShade}`;
    case "secondary":
      return `bg-${color}-100 hover:bg-${color}-200 text-${color}-800 dark:bg-${color}-900 dark:hover:bg-${color}-800 dark:text-${color}-200 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-${color}-${focusShade}`;
    case "outline":
      return `bg-transparent ring-2 ring-inset ring-${color}-${mainShade} text-${color}-${mainShade} hover:bg-${color}-100 dark:ring-${color}-400 dark:text-${color}-400 dark:hover:bg-${color}-900 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-${color}-${focusShade}`;
    case "ghost":
      return `bg-transparent hover:bg-${color}-${mainShade}/20 text-${color}-${mainShade} hover:text-${color}-${hoverShade} dark:hover:bg-${color}-${darkMainShade}/20 dark:text-${color}-400 dark:hover:text-${color}-${darkHoverShade} focus:outline-none focus:ring-2 ${ringOffset} focus:ring-${color}-${focusShade}`;
    case "link":
      return `text-${color}-${mainShade} hover:underline dark:text-${color}-400 focus:outline-none focus:ring-2 ${ringOffset} focus:ring-${color}-${focusShade}`;
    default:
      return "";
  }
};

const getIntentClasses = (
  type: Exclude<ButtonType, "default">,
  variant: Exclude<ButtonVariant, "simple" | "neutral" | "disabled">
): string => {
  // Map 'error' to 'red' and 'add' to 'emerald'
  const mappedColor: ButtonColor = type === "error" ? "red" : "emerald";
  return getVariantClasses(mappedColor, variant);
};

const baseStyles =
  "inline-flex items-center justify-center transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none font-medium";

const disabledStyles = "opacity-50 pointer-events-none";

const smButtonSize = " px-2 py-1 text-sm";
const mdButtonSize = " px-3 py-2 text-md";
const lgButtonSize = " px-4 py-3 text-lg";
const xlButtonSize = " px-4 py-3 text-xl";

const simpleStyles =
  "bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-white/60 text-white dark:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white";

const neutralStyles =
  "bg-gray-500 dark:bg-gray-500/40 hover:bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-700";

const shapeStyles: Record<ButtonShape, string> = {
  squircle: "rounded-xl",
  square: "rounded-lg",
  circle: "rounded-full px-2 py-2 min-w-[32px] min-h-[32px]",
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
  // Filter for valid Button children
  const buttons = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Button
  );

  if (buttons.length === 0) return null;

  return (
    <div
      className={cn(
        // Remove standard rounding and replace with group-specific rounding
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
          // Provide context to each button about its position in the group
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
      iconSize = 5,
      alt,
      size = "md",
      href,
      type = "default",
      ...rest
    } = props;

    // Consume group context
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

    const buttonSize = size;
    let buttonSizeClass = "";

    if (buttonSize === "sm") {
      buttonSizeClass = smButtonSize;
    } else if (buttonSize === "lg") {
      buttonSizeClass = lgButtonSize;
    } else if (buttonSize === "xl") {
      buttonSizeClass = xlButtonSize;
    } else {
      buttonSizeClass = mdButtonSize;
    }

    const isDisabled = disabled || loading;
    let variantClass = "";

    if (isDisabled) {
      variantClass = disabledStyles;
    } else if (
      type === "error" ||
      type === "add" ||
      type === "accept" ||
      type === "danger"
    ) {
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

    // START: Button Group Shape Logic (from buttonLogic.js)
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
    // END: Button Group Shape Logic

    if (isGrouped) {
      // Remove default individual rounding (e.g., rounded-xl) from shapeStyles[shape]
      // and apply the group-specific rounding from variantShapeClass
      shapeClass = cn(
        // Add a visual separator between buttons in the group
        groupPosition !== "last" &&
          "border-r border-white/40 dark:border-black/30",
        variantShapeClass
      );
      // Remove individual button shadow when inside a group
      variantClass = variantClass
        .replace(/shadow-lg/, "")
        .replace(/shadow-\w+-\d+\/\d+/, "");
    } else {
      // If not grouped, use the default rounding from shapeStyles[shape]
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

      const sizeClass = `h-${iconSize} w-${iconSize}`;

      const imageSizeClass = `h-${iconSize} w-auto object-contain`;

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
        return React.cloneElement(
          currentIcon as ReactElement<any, string | JSXElementConstructor<any>>,
          {
            className: cn(currentIcon.props.className, sizeClass),
          }
        );
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
        const sizeClass = `h-${iconSize} w-${iconSize}`;

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
