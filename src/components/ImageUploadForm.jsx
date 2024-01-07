import { useState } from "react";

const ImageUploadForm = ({ setOutputText }) => {
    const [textValue, setTextValue] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
  
    const handleTextChange = (e) => {
      setTextValue(e.target.value);
    };
  
    const handleImageChange = async (e) => {
      const file = e.target.files[0];
      const resizedFile = await resizeImage(file); // Resize the selected image
      setImageFile(resizedFile);
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
      setDragOver(true);
    };
  
    const handleDragLeave = () => {
      setDragOver(false);
    };
  
    const handleDrop = async (e) => {
      e.preventDefault();
      setDragOver(false);
  
      const file = e.dataTransfer.files[0];
      const resizedFile = await resizeImage(file); // Resize the dropped image
      setImageFile(resizedFile);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Text Input:', textValue);
      console.log('Image File:', imageFile);
      setOutputText(textValue)
      // Handle form submission logic here (e.g., sending data to the server)
    };
  
    const resizeImage = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
  
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxWidth = 300; // Set your desired maximum width
            const maxHeight = 300; // Set your desired maximum height
            let width = img.width;
            let height = img.height;
  
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
  
            canvas.width = width;
            canvas.height = height;
  
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
  
            canvas.toBlob((blob) => {
              const resizedFile = new File([blob], file.name, {
                type: 'image/jpeg', // Set your desired image type (jpeg, png, etc.)
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            }, 'image/jpeg');
          };
        };
      });
    };
  
    return (
      <div className="parent-container">
      <form onSubmit={handleSubmit}>
        <div className="text-input-container">
          <div className="input-wrapper">
          <label htmlFor="text-input">Paste Content: </label><br/>
          <input
            type="text"
            id="text-input"
            className="text-input"
            value={textValue}
            onChange={handleTextChange}
            placeholder="Enter text here"
          />
          </div>
        </div>
        <br/>
        <div
          className={dragOver ? 'image-upload drop-area' : 'image-upload'}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label htmlFor="image-upload" className="upload-label">
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Uploaded"
                className="uploaded-image"
              />
            ) : (
              <span>Drag & Drop or <u>Click</u> to Upload Image</span>
            )}
          </label>
          <input
            type="file"
            id="image-upload"
            accept=".jpg, .jpeg, .png"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
      </div>
    );
  };
  
  export default ImageUploadForm;