type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function getCroppedImage(
  imageSrc: string,
  crop: CropArea,
  fileName: string,
): Promise<File> {
  // STEP 1: LOAD ORIGINAL IMAGE
  const image = new window.Image();
  image.src = imageSrc;

  await image.decode();

  // STEP 2: CREATE CANVAS
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create image canvas");
  }

  // STEP 3: SET OUTPUT IMAGE SIZE
  const size = 400;

  canvas.width = size;
  canvas.height = size;

  // STEP 4: DRAW SELECTED CROPPED AREA
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    size,
    size,
  );

  // STEP 5: PRESERVE ORIGINAL FILENAME
  const baseName = fileName.replace(/\.[^.]+$/, "");

  const originalExtension = fileName.split(".").pop()?.toLowerCase();

  let croppedFileName: string;

  if (originalExtension === "jpeg") {
    croppedFileName = `${baseName}.jpeg`;
  } else if (originalExtension === "jpg") {
    croppedFileName = `${baseName}.jpg`;
  } else {
    // PNG and WebP are converted to JPEG
    croppedFileName = `${baseName}.jpg`;
  }

  // STEP 6: CONVERT CANVAS TO IMAGE FILE
  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to crop image"));
          return;
        }

        // STEP 7: CREATE CROPPED FILE
        const croppedFile = new File([blob], croppedFileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        resolve(croppedFile);
      },
      "image/jpeg",
      0.9,
    );
  });
}
