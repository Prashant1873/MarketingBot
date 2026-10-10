import React, { useRef, useState, useLayoutEffect, useEffect } from "react";

export interface FluidSegmentedOption<T extends string | number | undefined> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  sub?: string;
  badge?: React.ReactNode;
  title?: string;
  disabled?: boolean;
}

export interface FluidSegmentedControlProps<T extends string | number | undefined> {
  options: Array<FluidSegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  variant?: "primary" | "cyan" | "default";
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  role?: string;
  ariaLabel?: string;
  idPrefix?: string;
  buttonStyle?: React.CSSProperties;
}

export function FluidSegmentedControl<T extends string | number | undefined>({
  options,
  value,
  onChange,
  variant = "default",
  className = "",
  style = {},
  fill = false,
  role = "tablist",
  ariaLabel,
  idPrefix = "fluid-segmented",
  buttonStyle = {},
}: FluidSegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonMapRef = useRef<Map<T, HTMLButtonElement>>(new Map());
  const activeValueRef = useRef<T>(value);
  const currentAnimationRef = useRef<Animation | null>(null);
  const [, setMounted] = useState(false);

  // Helper to measure button bounds relative to container
  const getButtonRect = (targetValue: T) => {
    const container = containerRef.current;
    const btn = buttonMapRef.current.get(targetValue);
    if (!container || !btn) return null;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    return {
      left: Math.round(bRect.left - cRect.left),
      top: Math.round(bRect.top - cRect.top),
      width: Math.round(bRect.width),
      height: Math.round(bRect.height),
    };
  };

  // Animate indicator from fromVal to toVal with physical stretch & squish
  const animateTo = (fromVal: T, toVal: T, immediate = false) => {
    const indicator = indicatorRef.current;
    if (!indicator) return;

    const toRect = getButtonRect(toVal);
    if (!toRect) return;

    if (immediate) {
      if (currentAnimationRef.current) {
        currentAnimationRef.current.cancel();
      }
      indicator.style.left = `${toRect.left}px`;
      indicator.style.top = `${toRect.top}px`;
      indicator.style.width = `${toRect.width}px`;
      indicator.style.height = `${toRect.height}px`;
      indicator.style.opacity = "1";
      return;
    }

    const fromRect = getButtonRect(fromVal);
    if (!fromRect || (fromRect.left === toRect.left && fromRect.width === toRect.width)) {
      indicator.style.left = `${toRect.left}px`;
      indicator.style.top = `${toRect.top}px`;
      indicator.style.width = `${toRect.width}px`;
      indicator.style.height = `${toRect.height}px`;
      indicator.style.opacity = "1";
      return;
    }

    if (currentAnimationRef.current) {
      currentAnimationRef.current.cancel();
    }

    const isMovingForward = toRect.left > fromRect.left;
    let keyframes: Keyframe[] = [];

    if (isMovingForward) {
      // Forward stretch: stretches across both buttons to the right, squishes vertically
      const stretchLeft = fromRect.left;
      const stretchWidth = (toRect.left + toRect.width) - fromRect.left;

      keyframes = [
        {
          left: `${fromRect.left}px`,
          top: `${fromRect.top}px`,
          width: `${fromRect.width}px`,
          height: `${fromRect.height}px`,
          transform: "scaleY(1)",
        },
        {
          offset: 0.38,
          left: `${stretchLeft}px`,
          top: `${Math.min(fromRect.top, toRect.top)}px`,
          width: `${stretchWidth}px`,
          height: `${Math.max(fromRect.height, toRect.height)}px`,
          transform: "scaleY(0.82)", // Dramatic Poisson squish while stretched
        },
        {
          offset: 0.78,
          left: `${toRect.left}px`,
          top: `${toRect.top}px`,
          width: `${toRect.width}px`,
          height: `${toRect.height}px`,
          transform: "scaleY(1.04)", // Apple critically damped settle
        },
        {
          left: `${toRect.left}px`,
          top: `${toRect.top}px`,
          width: `${toRect.width}px`,
          height: `${toRect.height}px`,
          transform: "scaleY(1)",
        },
      ];
    } else {
      // Backward stretch: stretches across both buttons to the left, squishes vertically
      const stretchLeft = toRect.left;
      const stretchWidth = (fromRect.left + fromRect.width) - toRect.left;

      keyframes = [
        {
          left: `${fromRect.left}px`,
          top: `${fromRect.top}px`,
          width: `${fromRect.width}px`,
          height: `${fromRect.height}px`,
          transform: "scaleY(1)",
        },
        {
          offset: 0.38,
          left: `${stretchLeft}px`,
          top: `${Math.min(fromRect.top, toRect.top)}px`,
          width: `${stretchWidth}px`,
          height: `${Math.max(fromRect.height, toRect.height)}px`,
          transform: "scaleY(0.82)",
        },
        {
          offset: 0.78,
          left: `${toRect.left}px`,
          top: `${toRect.top}px`,
          width: `${toRect.width}px`,
          height: `${toRect.height}px`,
          transform: "scaleY(1.04)",
        },
        {
          left: `${toRect.left}px`,
          top: `${toRect.top}px`,
          width: `${toRect.width}px`,
          height: `${toRect.height}px`,
          transform: "scaleY(1)",
        },
      ];
    }

    // Set end styles
    indicator.style.left = `${toRect.left}px`;
    indicator.style.top = `${toRect.top}px`;
    indicator.style.width = `${toRect.width}px`;
    indicator.style.height = `${toRect.height}px`;
    indicator.style.opacity = "1";

    const anim = indicator.animate(keyframes, {
      duration: 320,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "none",
    });

    currentAnimationRef.current = anim;
  };

  // Immediate physical click handler
  const handleClick = (optId: T) => {
    if (Object.is(optId, value)) return;
    const prevVal = activeValueRef.current;
    activeValueRef.current = optId;
    animateTo(prevVal, optId, false);
    onChange(optId);
  };

  // Position indicator immediately on mount
  useLayoutEffect(() => {
    animateTo(value, value, true);
    setMounted(true);
  }, []);

  // Update when external prop changes (e.g. presets)
  useEffect(() => {
    if (!Object.is(activeValueRef.current, value)) {
      const prevVal = activeValueRef.current;
      activeValueRef.current = value;
      animateTo(prevVal, value, false);
    }
  }, [value]);

  // Recalculate on container resize without triggering animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      animateTo(activeValueRef.current, activeValueRef.current, true);
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      if (currentAnimationRef.current) {
        currentAnimationRef.current.cancel();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`studio-segmented fluid-rail ${className}`}
      role={role}
      aria-label={ariaLabel}
      style={{
        ...style,
        ...(fill ? { width: "100%", display: "flex" } : {}),
      }}
    >
      {/* Dynamic Stretch-and-Squish Active Indicator */}
      <div
        ref={indicatorRef}
        className={`studio-fluid-indicator variant-${variant}`}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* Action Buttons */}
      {options.map((opt, idx) => {
        const isSelected =
          Object.is(opt.id, value) || (opt.id === undefined && value === undefined);

        const activeClass = isSelected
          ? variant === "cyan"
            ? "active active-cyan"
            : "active"
          : "";

        return (
          <button
            key={String(opt.id ?? idx)}
            ref={(el) => {
              if (el) {
                buttonMapRef.current.set(opt.id, el);
              } else {
                buttonMapRef.current.delete(opt.id);
              }
            }}
            id={`${idPrefix}-${String(opt.id ?? idx).replace(/[^a-zA-Z0-9_-]/g, "-")}`}
            type="button"
            role={role === "tablist" ? "tab" : "button"}
            aria-selected={role === "tablist" ? isSelected : undefined}
            disabled={opt.disabled}
            title={opt.title}
            onClick={() => handleClick(opt.id)}
            className={`studio-fluid-btn ${activeClass}`}
            style={{
              ...(fill ? { flex: 1 } : {}),
              ...buttonStyle,
            }}
          >
            {opt.icon && <span style={{ display: "inline-flex", alignItems: "center" }}>{opt.icon}</span>}
            {opt.sub ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2 }}>
                <span style={{ fontSize: "12px", fontWeight: isSelected ? "700" : "600" }}>{opt.label}</span>
                <span style={{ fontSize: "10px", opacity: 0.75, fontFamily: "var(--font-mono)" }}>{opt.sub}</span>
              </div>
            ) : (
              <span>{opt.label}</span>
            )}
            {opt.badge && <span style={{ display: "inline-flex", alignItems: "center", marginLeft: "4px" }}>{opt.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
