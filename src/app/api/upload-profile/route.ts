import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select an image" },
        { status: 400 },
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG and WebP images are allowed" },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 5 MB" },
        { status: 400 },
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Image upload is not configured" },
        { status: 500 },
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: uploadData,
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success || !result.data?.url) {
      return NextResponse.json(
        { error: "Image upload failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      url: result.data.url,
    });
  } catch (error) {
    console.error("Profile image upload failed:", error);

    return NextResponse.json(
      { error: "Something went wrong while uploading" },
      { status: 500 },
    );
  }
}
