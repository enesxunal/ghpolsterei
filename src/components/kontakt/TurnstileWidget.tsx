"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileWidgetProps = {
  siteKey: string;
  onToken: (token: string) => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          appearance?: "always" | "execute" | "interaction-only";
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({ siteKey, onToken }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onToken);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    callbackRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile) {
      return;
    }

    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      appearance: "interaction-only",
      theme: "light",
      callback: (token) => callbackRef.current(token),
      "expired-callback": () => callbackRef.current(""),
      "error-callback": () => callbackRef.current(""),
    });

    return () => {
      window.turnstile?.remove(widgetId);
    };
  }, [scriptReady, siteKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="min-h-0" />
    </>
  );
}
