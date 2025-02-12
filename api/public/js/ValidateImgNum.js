function validateForm() {
    var fileInput = document.getElementById('image');
    var maxFiles = 3; // Change this to your desired maximum number of files
    // if(!fileInput){
    //     return true;
    // }
    // Check if the number of selected files exceeds the limit
    if (fileInput.files.length > maxFiles) {
        alert('You can only upload a maximum of ' + maxFiles + ' images.');
        return false; // Prevent form submission
    }
    return true; // Allow form submission
}