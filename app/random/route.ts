import { NextResponse } from "next/server";
import { wallpapers } from "@/lib/wallpapers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const randomWallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
  const path = `/${randomWallpaper.category}/${randomWallpaper.slug}-${randomWallpaper.id}.html`;

  return NextResponse.redirect(new URL(path, request.url), 307);
}
