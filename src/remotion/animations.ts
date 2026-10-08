import { spring, interpolate } from "remotion";

export const springConfigs = {
  // Heavy kinetic impact for opening hooks and title slams
  slam: { damping: 12, stiffness: 200, mass: 0.6 },
  // Smooth natural motion for UI cards and supporting text
  gentle: { damping: 20, stiffness: 100, mass: 1 },
  // Subtle oscillating float for 3D devices and backdrop elements
  float: { damping: 15, stiffness: 80, mass: 1 },
};

/**
 * Calculates entrance slam animation progress (scale: from 1.6 down to 1.0, opacity: 0 to 1)
 */
export function calculateSlamEntrance(frame: number, fps: number = 30, delay: number = 0) {
  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: springConfigs.slam,
  });

  const scale = interpolate(spr, [0, 1], [1.5, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(spr, [0, 0.4, 1], [0, 0.8, 1], {
    extrapolateRight: "clamp",
  });

  return { scale, opacity, spr };
}

/**
 * Calculates smooth upward card entrance (translateY: from 40px down to 0, opacity: 0 to 1)
 */
export function calculateCardSlideUp(frame: number, fps: number = 30, delay: number = 0) {
  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: springConfigs.gentle,
  });

  const translateY = interpolate(spr, [0, 1], [40, 0], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(spr, [0, 0.3, 1], [0, 0.7, 1], {
    extrapolateRight: "clamp",
  });

  return { translateY, opacity, spr };
}

/**
 * Calculates continuous floating 3D perspective gyro tilt
 */
export function calculateGyroTilt(frame: number, fps: number = 30) {
  const time = frame / fps;
  // Subtle harmonic sine/cosine motion
  const rotateX = Math.sin(time * 1.5) * 4;
  const rotateY = Math.cos(time * 1.2) * 6;
  const floatY = Math.sin(time * 2) * 8;

  return {
    rotateX,
    rotateY,
    floatY,
    transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(${floatY.toFixed(2)}px)`,
  };
}
