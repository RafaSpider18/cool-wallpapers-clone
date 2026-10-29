"use client";

import { useState } from "react";
import type { WallpaperResolution } from "@/lib/wallpapers";

type ResolutionPickerProps = {
  slug: string;
  resolutions: WallpaperResolution[];
  defaultLabel?: string;
};

export function ResolutionPicker({
  slug,
  resolutions,
  defaultLabel = "4K",
}: ResolutionPickerProps) {
  const initialIndex = Math.max(
    0,
    resolutions.findIndex((resolution) => resolution.label === defaultLabel),
  );
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const selected = resolutions[selectedIndex] ?? resolutions[0];

  if (!selected) return null;

  return (
    <div className="mt-6">
      <fieldset>
        <legend className="text-sm font-medium text-text">Resolución</legend>
        <div className="mt-2 inline-flex rounded-button border border-border bg-surface p-1">
          {resolutions.map((resolution, index) => {
            const checked = index === selectedIndex;
            return (
              <label key={resolution.label} className="cursor-pointer">
                <input
                  type="radio"
                  name="resolution"
                  value={resolution.label}
                  checked={checked}
                  onChange={() => setSelectedIndex(index)}
                  className="peer sr-only"
                />
                <span
                  className={`block rounded-[6px] px-3 py-1.5 text-sm transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                    checked
                      ? "bg-accent font-semibold text-bg"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {resolution.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="mt-3 text-muted">
        Resolución: {selected.label} ({selected.width} × {selected.height})
      </p>

      <a
        href={selected.url}
        download={`${slug}-${selected.width}x${selected.height}.svg`}
        className="mt-4 inline-block rounded-[8px] bg-accent px-6 py-3 text-sm font-semibold text-bg"
      >
        Download {selected.label}
      </a>
    </div>
  );
}
