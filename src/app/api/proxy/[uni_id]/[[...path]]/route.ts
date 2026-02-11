import { NextRequest, NextResponse } from "next/server";

const UNI_MAP: Record<string, string> = {
  nuzp: "https://api.zp.edu.ua",
  knu: "https://api.knu.ua",
  lpnu: "https://api.lpnu.ua",
};

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ uni_id: string; path?: string[] }> },
) {
  const { uni_id, path } = await params;
  const baseUrl = UNI_MAP[uni_id];

  if (!baseUrl) {
    return NextResponse.json(
      { error: `University '${uni_id}' not supported` },
      { status: 404 },
    );
  }

  const pathStr = path ? path.join("/") : "";
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = `${baseUrl}/${pathStr}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!["host", "content-length", "connection"].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  try {
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: headers,
      // @ts-ignore
      duplex: "half",
    };

    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      const contentType = request.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        fetchOptions.body = JSON.stringify(await request.json());
      } else {
        // Handle other body types if necessary
        fetchOptions.body = await request.blob();
      }
    }

    const response = await fetch(targetUrl, {
      ...fetchOptions,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const respHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (
        ![
          "content-encoding",
          "content-length",
          "transfer-encoding",
          "connection",
        ].includes(key.toLowerCase())
      ) {
        respHeaders.set(key, value);
      }
    });

    // Add CORS headers just in case
    respHeaders.set("Access-Control-Allow-Origin", "*");
    respHeaders.set(
      "X-Proxy-Cache",
      response.headers.get("x-nextjs-cache") || "MISS",
    );

    const data = await response.arrayBuffer();
    return new NextResponse(data, {
      status: response.status,
      headers: respHeaders,
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const OPTIONS = handler;
