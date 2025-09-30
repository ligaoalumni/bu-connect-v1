import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";

  const res = await fetch(
    `http://universities.hipolabs.com/search?name=${name}`,
  );
  const data = await res.json();

  return NextResponse.json(data);
}
