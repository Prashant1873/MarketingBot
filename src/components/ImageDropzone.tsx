import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Loader2, Sparkles, Monitor } from "lucide-react";
import { ImageDimensions, ScreenMode } from "../types";
import { FluidSegmentedControl } from "./FluidSegmentedControl";

interface ImageDropzoneProps {
  imageUrl: string | null;
  imageFilename: string | null;
  onImageChange: (url: string | null, filename: string | null, dimensions?: ImageDimensions | null) => void;
  screenMode?: ScreenMode;
  onScreenModeChange?: (mode: ScreenMode) => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  imageUrl,
  imageFilename,
  onImageChange,
  screenMode = "mockup",
  onScreenModeChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setError(null);

    // Client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPEG, PNG, WEBP, or GIF image.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("Image size exceeds 25MB limit.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      let dims: ImageDimensions | null = data.dimensions || null;
      if (!dims) {
        try {
          const img = new Image();
          await new Promise<void>((resolve) => {
            img.onload = () => {
              dims = {
                width: img.naturalWidth,
                height: img.naturalHeight,
                aspectRatio: Number((img.naturalWidth / img.naturalHeight).toFixed(3)),
              };
              resolve();
            };
            img.onerror = () => resolve();
            img.src = data.url;
          });
        } catch {
          // ignore
        }
      }

      onImageChange(data.url, data.filename, dims);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading image";
      setError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null, null, null);
    setError(null);
  };

  return (
    <section className="studio-panel" style={{ padding: "24px" }} aria-labelledby="image-dropzone-heading">
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <ImageIcon size={18} color="var(--accent-secondary)" />
        <h2 id="image-dropzone-heading" style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "-0.01em" }}>
          Product Visual & Hero Asset
        </h2>
        <span
          className="studio-badge"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            color: "var(--text-muted)",
            marginLeft: "auto",
          }}
        >
          Optional
        </span>
      </div>

      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.5" }}>
        Attach an app UI screenshot, dashboard mockup, or product photo. Marcutie animates dynamic camera pans, 3D tilts, and feature highlights on it.
      </p>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={handleFileSelect}
        aria-label="Upload product screenshot or mockup"
      />

      {/* Upload area or Preview */}
      {imageUrl ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            className="studio-card"
            style={{
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              border: "1px solid var(--border-medium)",
              background: "var(--bg-surface-2)",
            }}
          >
            {/* Thumbnail preview */}
            <div
              style={{
                width: "96px",
                height: "64px",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
                border: "1px solid var(--border-subtle)",
                flexShrink: 0,
                background: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={imageUrl}
                alt="Uploaded Product Visual"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Info telemetry */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {imageFilename}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--success)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--success)",
                    display: "inline-block",
                  }}
                />
                Active in video composition
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary"
                style={{
                  fontSize: "12px",
                  padding: "8px 14px",
                  minHeight: "38px",
                }}
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="btn-ghost"
                style={{
                  padding: "8px",
                  minHeight: "38px",
                  minWidth: "38px",
                  color: "var(--danger)",
                }}
                title="Remove image"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Screen Render Mode Segmented Control */}
          {onScreenModeChange && (
            <div
              style={{
                padding: "14px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)" }}>
                  Render Mode:
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: screenMode === "mockup" ? "var(--accent-primary)" : "var(--accent-secondary)",
                  }}
                >
                  {screenMode === "mockup" ? "Synthesized HTML/CSS" : "Direct Screenshot"}
                </span>
              </div>

              {/* Tactile Segmented Control with Stretch-and-Squish Indicator */}
              <FluidSegmentedControl<ScreenMode>
                value={screenMode}
                onChange={onScreenModeChange}
                variant="primary"
                fill
                idPrefix="dropzone-mode"
                buttonStyle={{ minHeight: "40px", fontSize: "12px", fontWeight: "700" }}
                options={[
                  {
                    id: "mockup",
                    icon: <Sparkles size={14} color={screenMode === "mockup" ? "#ffffff" : "var(--accent-primary)"} />,
                    label: "Synthesized UI",
                  },
                  {
                    id: "screenshot",
                    icon: <Monitor size={14} color={screenMode === "screenshot" ? "#08090d" : "var(--accent-secondary)"} />,
                    label: "Direct Screenshot",
                  },
                ]}
              />

              <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                {screenMode === "mockup"
                  ? "Builds a crisp, high-framerate HTML/CSS interface matching your prompt and brand colors."
                  : "Preserves your exact original uploaded image inside simulated device frames."}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !isUploading) {
              fileInputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? "var(--accent-primary)" : "var(--border-subtle)"}`,
            borderRadius: "var(--radius-md)",
            padding: "36px 20px",
            textAlign: "center",
            cursor: isUploading ? "wait" : "pointer",
            background: isDragging ? "rgba(99, 102, 241, 0.08)" : "var(--bg-surface-2)",
            transition: "all var(--dur-fast) var(--ease-settle)",
            minHeight: "140px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Upload visual asset drag and drop zone"
        >
          {isUploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <Loader2 size={32} color="var(--accent-primary)" className="animate-spin" />
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>
                Uploading & extracting color palette...
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--bg-surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isDragging ? "var(--accent-primary)" : "var(--text-secondary)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <UploadCloud size={24} />
              </div>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--accent-primary)" }}>
                  Click to upload
                </span>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}> or drag and drop visual</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                PNG, JPG, WEBP or GIF (Up to 25MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
            fontSize: "12px",
            color: "var(--danger)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          role="alert"
        >
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}
    </section>
  );
};
