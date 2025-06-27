import { useState, useEffect, CSSProperties } from "react";

interface CustomAnimationConfig {
  isMounted: boolean;
  delayTime: number;
  mountedStyle: CSSProperties;
  unmountedStyle: CSSProperties;
}

// Applies a CSS animation on mount & unmount
//  - You must control the visibility of the animated element with the returned "showComponent" parameter
//    Otherwise the component may unmount before the animation is finished
//  - Directly apply the returned `styles` parameter to the animated element `<div style={styles}>`
export function useCustomAnimation(config: CustomAnimationConfig) {
  const mountedStyle: CSSProperties = {
    ...config.mountedStyle,
    transition: `all ${config.delayTime}ms ease-out`,
  };
  const unmountedStyle: CSSProperties = {
    ...config.unmountedStyle,
    transition: `all ${config.delayTime}ms ease-in`,
  };

  const [style, setStyle] = useState(
    config.isMounted ? mountedStyle : unmountedStyle
  );
  const [showComponent, setShowComponent] = useState(config.isMounted);

  useEffect(() => {
    let timeoutId: number;
    if (config.isMounted) {
      setShowComponent(true);
      timeoutId = setTimeout(() => setStyle(mountedStyle), 10);
    } else {
      timeoutId = setTimeout(() => setShowComponent(false), config.delayTime);
      setStyle(unmountedStyle);
    }
    return () => clearTimeout(timeoutId);
  }, [config.isMounted, config.delayTime]);
  return { showComponent, style };
}
