const API = "/api";
const token = localStorage.getItem("token");

// UI Elements
const fileInput = document.getElementById("fileInput");
const fileNameDisplay = document.getElementById("fileNameDisplay");
const fileLabel = document.getElementById("fileLabel");
const uploadsContainer = document.getElementById("uploads");
const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");
const emptyState = document.getElementById("emptyState");
const fileCount = document.getElementById("fileCount");

// 🔒 AUTH GUARD
if (!token) {
    window.location.href = "/";
}

// =====================
// FILE SELECTION
// =====================
fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        fileNameDisplay.textContent = `Selected: ${selectedFile.name}`;
        fileLabel.style.display = "none";
    } else {
        resetUploadUI();
    }
});

function resetUploadUI() {
    fileInput.value = "";
    fileNameDisplay.textContent = "";
    fileLabel.style.display = "block";
}

// =====================
// FORMAT FILE SIZE
// =====================
function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// =====================
// UPLOAD FILE
// =====================
async function uploadFile() {
    const file = fileInput.files[0];

    if (!file) {
        uploadStatus.textContent = "Please select a file.";
        uploadStatus.style.color = "red";
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Loader UI
    uploadBtn.disabled = true;
    uploadBtn.textContent = "Uploading...";
    uploadStatus.textContent = "";

    try {
        const res = await fetch(`${API}/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            uploadStatus.textContent = data.message || "Upload failed";
            uploadStatus.style.color = "red";
            uploadBtn.disabled = false;
            uploadBtn.textContent = "Upload Now";
            return;
        }

        uploadStatus.textContent = "Upload successful ✅";
        uploadStatus.style.color = "green";

        resetUploadUI();
        loadUploads();
    } catch (err) {
        uploadStatus.textContent = "Upload error.";
        uploadStatus.style.color = "red";
    }

    uploadBtn.disabled = false;
    uploadBtn.textContent = "Upload Now";
}

// =====================
// LOAD UPLOADS
// =====================
async function loadUploads() {
    const res = await fetch(`${API}/uploads`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        logout();
        return;
    }

    const files = await res.json();
    uploadsContainer.innerHTML = "";

    // Update count
    fileCount.textContent = `${files.length} file${files.length !== 1 ? "s" : ""}`;

    // Empty state
    if (files.length === 0) {
        emptyState.style.display = "block";
        return;
    } else {
        emptyState.style.display = "none";
    }

    files.forEach(file => {
        const card = document.createElement("div");
        card.className = "media-card";

        const isImage = /\.(jpe?g|png|gif|webp)$/i.test(file.filename);

        const previewContent = isImage
            ? `<img src="${file.path}" style="width:100%; height:100%; object-fit:cover;">`
            : `<span style="font-size:40px;">📄</span>`;

        card.innerHTML = `
            <div class="thumbnail">${previewContent}</div>
            <div class="info">
                <span class="filename" title="${file.filename}">${file.filename}</span>
                ${file.size ? `<small class="filesize">${formatSize(file.size)}</small>` : ""}
                <div class="actions">
                    <a href="${file.path}" download class="btn-action">Download</a>
                    <button class="btn-delete" onclick="deleteFile('${file._id}')">Delete</button>
                </div>
            </div>
        `;

        uploadsContainer.appendChild(card);
    });
}

// =====================
// DELETE FILE
// =====================
async function deleteFile(id) {
    if (!confirm("Delete this file?")) return;

    await fetch(`${API}/uploads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });

    loadUploads();
}

// INITIAL LOAD
loadUploads();

