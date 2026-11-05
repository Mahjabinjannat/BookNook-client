"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";

import { getCroppedImage } from "@/lib/cropImage";

interface ProfilePhotoCropperProps {
  imageSrc: string;
  fileName: string;
  onSave: (file: File) => void;
  onCancel: () => void;
}

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function ProfilePhotoCropper({
  imageSrc,
  fileName,
  onSave,
  onCancel,
}: ProfilePhotoCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  const handleCropComplete = useCallback(
    (_croppedArea: CropArea, croppedPixels: CropArea) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  const handleSave = async () => {
    if (!croppedAreaPixels || saving) return;

    setSaving(true);

    try {
      const croppedFile = await getCroppedImage(
        imageSrc,
        croppedAreaPixels,
        fileName,
      );

      onSave(croppedFile);
    } catch (error) {
      console.error("Image cropping failed:", error);
      toast.error("Failed to crop the profile photo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Crop profile photo"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        {/* HEADER */}
        <h2 className="text-xl font-semibold text-[#19271f]">
          Adjust Profile Photo
        </h2>

        <p className="mt-2 text-sm text-[#68746b]">
          Drag the image to position your face inside the circle. Use the slider
          to zoom in or out.
        </p>

        {/* CROPPER */}
        <div className="relative mt-5 h-[300px] w-full overflow-hidden rounded-xl bg-[#202020] sm:h-[360px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            objectFit="contain"
            minZoom={1}
            maxZoom={3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        {/* ZOOM */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor="photoZoom"
              className="text-sm font-medium text-[#24362b]"
            >
              Zoom
            </label>

            <span className="text-sm text-[#68746b]">{zoom.toFixed(1)}x</span>
          </div>

          <div className="flex items-center gap-4">
            <ZoomOut size={19} className="text-[#68746b]" />

            <input
              id="photoZoom"
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full cursor-pointer accent-[#1d513b]"
            />

            <ZoomIn size={19} className="text-[#68746b]" />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 rounded-full border border-[#d7dfd5] px-5 py-3 text-sm font-semibold text-[#24362b] transition hover:bg-[#f7f8f4] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !croppedAreaPixels}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1d513b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#153e2c] disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Cropping...
              </>
            ) : (
              "Save Photo"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
