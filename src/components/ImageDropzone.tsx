import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Loader2 } from "lucide-react";

interface ImageDropzoneProps {
  imageUrl: string | null;
  imageFilename: string | null;
  onImageChange: (url: string | null, filename: string | null) => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  imageUrl,
  imageFilename,
  onImageChange,
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

      onImageChange(data.url, data.filename);
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
    onImageChange(null, null);
    setError(null);
  };

  return (
    <div className="glass-panel" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <ImageIcon size={18} color="var(--accent-secondary)" />
        <h2 style={{ fontSize: "15px", fontWeight: "700" }}>Product Screenshot / Hero Visual</h2>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "auto" }}>Optional</span>
      </div>

      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.4" }}>
        Upload a product screenshot, app UI mockup, or hardware photo. Marcutie's composition engine will animate dynamic camera zooms, 3D tilts, and feature highlights on it.
      </p>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {/* Upload area or Preview */}
      {imageUrl ? (
        <div
          style={{
            position: "relative",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--border-highlight)",
            background: "rgba(10, 15, 26, 0.8)",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Thumbnail preview */}
          <div
            style={{
              width: "100px",
              height: "70px",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              border: "1px solid var(--border-color)",
              flexShrink: 0,
              background: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={imageUrl}
              alt="Uploaded Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Info */}
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
            <div style={{ fontSize: "12px", color: "var(--success)", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              Ready for video composition
            </div>
          </div>

          {/* Remove / replace actions */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary"
              style={{ fontSize: "12px", padding: "6px 12px" }}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="btn-ghost"
              style={{ padding: "6px", color: "var(--danger)" }}
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? "var(--accent-primary)" : "var(--border-color)"}`,
            borderRadius: "var(--radius-md)",
            padding: "32px 20px",
            textAlign: "center",
            cursor: isUploading ? "wait" : "pointer",
            background: isDragging ? "rgba(99, 102, 241, 0.08)" : "rgba(10, 15, 26, 0.4)",
            transition: "all 0.2s ease",
          }}
        >
          {isUploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <Loader2 size={32} color="var(--accent-primary)" style={{ animation: "spin 1s linear infinite" }} />
              <div style={{ fontSize: "13px", fontWeight: "600" }}>Uploading and processing visual...</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isDragging ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
              >
                <UploadCloud size={24} />
              </div>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--accent-primary)" }}>
                  Click to upload
                </span>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}> or drag and drop</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                PNG, JPG, WEBP or GIF (Max 25MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            background: "var(--danger-bg)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            fontSize: "12px",
            color: "var(--danger)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
