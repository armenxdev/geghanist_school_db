import React, { useRef, useState } from "react";

const ACCEPT = "image/*,video/*";
const MAX_FILE_MB = 50;

/**
 * Converts a File to a local preview URL + metadata object.
 * The backend expects { url, type } — for real uploads you'd upload first,
 * then pass the returned CDN url. Here we keep a `file` reference so the
 * parent can handle upload logic.
 */
const fileToMediaItem = (file) => ({
    id: `${Date.now()}-${Math.random()}`,
    file,
    previewUrl: URL.createObjectURL(file),
    type: file.type.startsWith("video/") ? "video" : "image",
    name: file.name,
});

const MediaUploader = ({ items, onChange }) => {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");

    const validate = (files) => {
        for (const f of files) {
            if (f.size > MAX_FILE_MB * 1024 * 1024) {
                setError(`"${f.name}" exceeds the ${MAX_FILE_MB} MB limit.`);
                return false;
            }
            if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) {
                setError(`"${f.name}" is not a supported image or video file.`);
                return false;
            }
        }
        setError("");
        return true;
    };

    const addFiles = (files) => {
        if (!validate(files)) return;
        const newItems = Array.from(files).map(fileToMediaItem);
        onChange([...items, ...newItems]);
    };

    const handleInputChange = (e) => {
        if (e.target.files?.length) addFiles(e.target.files);
        e.target.value = "";           // reset so same file can be re-added
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    };

    return (
        <div className="media-uploader">
            <div
                className={`drop-zone ${dragOver ? "drop-zone--active" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                aria-label="Upload media files"
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT}
                    multiple
                    hidden
                    onChange={handleInputChange}
                />
                <div className="drop-zone__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </div>
                <p className="drop-zone__title">Drop files here or click to upload</p>
                <p className="drop-zone__hint">Images & videos · Max {MAX_FILE_MB} MB each</p>
            </div>
            {error && <div className="form-error" style={{ marginTop: "0.5rem" }}>{error}</div>}
        </div>
    );
};

export default MediaUploader;