const dropArea = document.getElementById('drop-area') as HTMLElement;
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const fileNameLabel = document.getElementById('file-name-label') as HTMLElement;
const graph = document.getElementById('graph-card') as HTMLButtonElement;
const routeSelect = document.getElementById('route-select') as HTMLSelectElement;

dropArea.addEventListener('click', () => fileInput.click());

dropArea.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    dropArea.classList.add('bg-gray-200');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('bg-gray-200');
});

dropArea.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    dropArea.classList.remove('bg-gray-200');
    if (e.dataTransfer?.files.length) {
        fileInput.files = e.dataTransfer.files;
        // Handle the file as needed
    }
});

fileInput.addEventListener('change', () => {
    if ( fileInput == null || fileInput.files == null ) {
        return;
    }
    graph.hidden = fileInput.files.length === 0;

    if (fileInput.files.length) {
        fileNameLabel.textContent = `Selected file: ${fileInput.files[0].name}`;
    }
});

