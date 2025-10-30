import type { CSSProperties, MouseEvent } from "react";

const DEFAULT_SIZE = 26;

export type PinAnchor = "center" | "top" | "bottom" | "left" | "right";

export interface PinProps {
  id: string;
  type: string;
  x: number;
  y: number;
  label?: string;
  anchor?: PinAnchor;
  color: string;
  size?: number;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export function Pin({
  id,
  type,
  x,
  y,
  label,
  anchor = "bottom",
  color,
  size = DEFAULT_SIZE,
  opacity = 0.75,
  className,
  style,
  onClick,
}: PinProps) {
  const half = size / 2;
  const anchorTransform = getAnchorTransform(anchor, half);
  const combinedStyle: CSSProperties = {
    left: `${x}px`,
    top: `${y}px`,
    width: `${size}px`,
    height: `${size}px`,
    background: color,
    opacity,
    transform: `translate(${anchorTransform.x}px, ${anchorTransform.y}px)`,
    ...style,
  };

  return (
    <div
      className={className ? `map-pin ${className}` : "map-pin"}
      style={combinedStyle}
      role="button"
      tabIndex={-1}
      aria-label={label ?? type}
      data-pin-id={id}
      onClick={onClick}
    >
      {label ? <div className="map-pin-label">{label}</div> : null}
    </div>
  );
}

function getAnchorTransform(anchor: PinAnchor, halfSize: number) {
  switch (anchor) {
    case "top":
      return { x: -halfSize, y: 0 };
    case "bottom":
      return { x: -halfSize, y: -halfSize * 2 };
    case "left":
      return { x: 0, y: -halfSize };
    case "right":
      return { x: -halfSize * 2, y: -halfSize };
    case "center":
    default:
      return { x: -halfSize, y: -halfSize };
  }
}

export default Pin;
