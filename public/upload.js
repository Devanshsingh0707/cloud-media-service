const API = "/api";
const token = localStorage.getItem("token");

// UI Elements
const fileInput = document.getElementById("fileInput");
const fileNameDisplay = document.getElementById("fileNameDisplay");
const fileLabel = document.getElementById("fileLabel");
const uploadsContainer = document.getElementById("uploads");

// 🔒 AUTH GUARD
if (!token) {
    alert("Please login first");
    window.location.href = "/login_register.html";
}

// LOGOUT
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login_register.html";
}

// =====================
// FILE SELECTION LISTENER
// =====================
fileInput.addEventListener('change', function() {
    if (fileInput.files.length > 0) {
        const selectedFileName = fileInput.files[0].name;
        fileNameDisplay.textContent = "Selected: " + selectedFileName;
        fileLabel.style.display = 'none';
    } else {
        resetUploadUI();
    }
});

function resetUploadUI() {
    fileInput.value = "";
    fileNameDisplay.textContent = "";
    fileLabel.style.display = 'block';
}

// =====================
// UPLOAD FILE
// =====================
async function uploadFile() {
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`${API}/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Upload failed");
            return;
        }

        alert("Upload successful");
        resetUploadUI(); // ✨ Clears the "Selected: filename" text
        loadUploads();
    } catch (err) {
        console.error("Upload error:", err);
    }
}

// =====================
// LOAD UPLOADS (Modern Card Grid)
// =====================
async function loadUploads() {
    const res = await fetch(`${API}/uploads`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        alert("Session expired. Login again.");
        logout();
        return;
    }

    const files = await res.json();
    uploadsContainer.innerHTML = "";

    files.forEach(file => {
        // Create the modern card structure
        const card = document.createElement("div");
        card.className = "media-card";

        // Check if it's an image to show a preview, otherwise show an icon placeholder
        const isImage = /\.(jpe?g|png|gif|webp)$/i.test(file.filename);
        const previewContent = isImage 
            ? `<img src="${file.path}" style="width:100%; height:100%; object-fit:cover;">` 
            : `<span>📄</span>`;

        card.innerHTML = `
            <div class="thumbnail">${previewContent}</div>
            <div class="info">
                <span class="filename" title="${file.filename}">${file.filename}</span>
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
    if (!confirm("Are you sure you want to delete this file?")) return;

    await fetch(`${API}/uploads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });

    loadUploads();
}

// INITIAL LOAD
loadUploads();