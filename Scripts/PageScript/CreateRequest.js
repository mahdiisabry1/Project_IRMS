document.getElementById('uploadBox').addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.background = '#f0f0f0';  // Change background when file is dragged over
});

document.getElementById('uploadBox').addEventListener('dragleave', function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.background = '';  // Reset background when file is dragged out
});

document.getElementById('uploadBox').addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.background = '';  // Reset background after file is dropped

    const file = e.dataTransfer.files[0]; // Get the first file from dropped files
    if (file) {
        document.getElementById('cvFile').files = e.dataTransfer.files;  // Trigger the file input with the dropped file
        uploadFile(file); // Call the function to handle the file upload
    }
});

document.getElementById('cvFile').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        uploadFile(file); // Handle file upload when file is selected
    }
});
