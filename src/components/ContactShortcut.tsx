
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import {
  liquidMetalFragmentShader,
  ShaderMount,
} from "@paper-design/shaders";
import { Sparkles } from "lucide-react";
import "./ContactShortcut.css";

type ContactShortcutProps = {
  onNavigate: (path: string) => void;
};

type ShaderInstance = ShaderMount & {
  destroy?: () => void;
  dispose?: () => void;
  setSpeed?: (speed: number) => void;
};

export function ContactShortcut({
  onNavigate,
}: ContactShortcutProps) {
  const shaderRef = useRef<HTMLSpanElement>(null);
  const shaderMount = useRef<ShaderInstance | null>(null);

  const [isFooterVisible, setIsFooterVisible] =
    useState(false);

  /* ==========================================
     LIQUID METAL SHADER
     ========================================== */

  useEffect(() => {
    const element = shaderRef.current;
    if (!element) return;

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (mediaQuery.matches) return;

    let mount: ShaderInstance | null = null;

    try {
      mount = new ShaderMount(
        element,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        },
        undefined,
        0.6
      );

      shaderMount.current = mount;
    } catch (error) {
      console.error(
        "Liquid metal shader initialization failed:",
        error
      );
    }

    return () => {
      shaderMount.current = null;

      if (!mount) return;

      try {
        if (typeof mount.destroy === "function") {
          mount.destroy();
        } else if (typeof mount.dispose === "function") {
          mount.dispose();
        }
      } catch (error) {
        console.error("Shader cleanup failed:", error);
      }
    };
  }, []);

  /* ==========================================
     FOOTER VISIBILITY DETECTION
     ========================================== */

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let observedFooter: Element | null = null;

    const observeFooter = () => {
      const footer = document.querySelector("footer");

      if (!footer) {
        setIsFooterVisible(false);
        return;
      }

      if (footer === observedFooter) return;

      observer?.disconnect();

      observedFooter = footer;

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsFooterVisible(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0,
        }
      );

      observer.observe(footer);
    };

    observeFooter();

    // Supports pages where the footer is
    // mounted dynamically during navigation.
    mutationObserver = new MutationObserver(() => {
      observeFooter();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer?.disconnect();
      mutationObserver?.disconnect();
    };
  }, []);

  /* ==========================================
     BUTTON INTERACTIONS
     ========================================== */

  const handleMouseEnter = () => {
    if (isFooterVisible) return;

    shaderMount.current?.setSpeed?.(1);
  };

  const handleMouseLeave = () => {
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    onNavigate("contact");
  };

  /* ==========================================
     COMPONENT
     ========================================== */

  return (
    <a
      href="/contact"
      className={`whatsapp-float ${
        isFooterVisible
          ? "whatsapp-float--hidden"
          : ""
      }`}
      aria-label="Contact Kanagadhara Sweets"
      title="Need a hand?"
      aria-hidden={isFooterVisible}
      tabIndex={isFooterVisible ? -1 : 0}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated liquid metal border */}
      <span
        ref={shaderRef}
        className="liquid-metal-border"
        aria-hidden="true"
      />

      {/* Premium forest green center */}
      <span
        className="liquid-metal-inner"
        aria-hidden="true"
      >
        <Sparkles
          size={30}
          strokeWidth={1.7}
          className="contact-sparkle-icon"
        />
      </span>
    </a>
  );
}
