"use client";

import { useEffect } from "react";
import Link from "next/link";

export const CATEGORIES = [
  { slug: "abstract", label: "Abstract" },
  { slug: "animals", label: "Animals" },
  { slug: "anime", label: "Anime" },
  { slug: "architecture", label: "Architecture" },
  { slug: "bikes", label: "Bikes" },
  { slug: "black-dark", label: "Black/Dark" },
  { slug: "cars", label: "Cars" },
  { slug: "celebrations", label: "Celebrations" },
  { slug: "cute", label: "Cute" },
  { slug: "fantasy", label: "Fantasy" },
  { slug: "flowers", label: "Flowers" },
  { slug: "food", label: "Food" },
  { slug: "games", label: "Games" },
  { slug: "gradients", label: "Gradients" },
  { slug: "cgi", label: "CGI" },
  { slug: "lifestyle", label: "Lifestyle" },
  { slug: "love", label: "Love" },
  { slug: "military", label: "Military" },
  { slug: "minimal", label: "Minimal" },
  { slug: "movies", label: "Movies" },
  { slug: "music", label: "Music" },
  { slug: "nature", label: "Nature" },
  { slug: "people", label: "People" },
  { slug: "photography", label: "Photography" },
  { slug: "quotes", label: "Quotes" },
  { slug: "scifi", label: "Sci-Fi" },
  { slug: "space", label: "Space" },
  { slug: "sports", label: "Sports" },
  { slug: "technology", label: "Technology" },
  { slug: "world", label: "World" },
];

type CategoryMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function CategoryMenu({
  open,
  onClose,
}: CategoryMenuProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      id="category-menu"
      className={`absolute right-0 top-full z-40 mt-2 w-72 rounded-card border border-border bg-surface p-4 shadow-lg lg:w-96 ${
        open ? "block" : "hidden"
      }`}
    >
      <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/${category.slug}`}
              onClick={onClose}
              className="block rounded-button px-3 py-2 text-sm text-text transition-colors hover:bg-surface-2"
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
