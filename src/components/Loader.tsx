"use client";

import React, { useEffect, useState } from "react";

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [svgMarkup, setSvgMarkup] = useState<string>("");

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2500);

    fetch("/assets/drishyam-opticals-playful-loader.json")
      .then((response) => response.json())
      .then((data) => {
        if (typeof data?.svg === "string") {
          const responsiveSvg = data.svg.replace(
            /<svg\b/i,
            '<svg style="display:block;width:100%;height:auto;max-width:540px;" '
          );
          setSvgMarkup(responsiveSvg);
        }
      })
      .catch(() => {
        setSvgMarkup("");
      });

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fffaf5] px-4 transition-opacity duration-500">
      <div className="flex w-full items-center justify-center">
        {svgMarkup ? (
          <div
            className="flex w-full max-w-[540px] items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        ) : (
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.35em] text-[#111111]/70">

          </div>
        )}
      </div>
    </div>
  );
}
