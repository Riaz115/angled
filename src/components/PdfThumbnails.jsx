import React, { useEffect, useState } from "react";
import generatePdfThumbnails from "pdf-thumbnails-generator";

const PdfThumbnails = ({
  pdfFile,
  thumbnailSize = 500,
  viewedCards,
  index,
}) => {
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        // Pass the PDF file source and thumbnail size
        const thumbnailImages = await generatePdfThumbnails(
          pdfFile,
          thumbnailSize
        );
        console.log(thumbnailImages);
        setThumbnails(thumbnailImages);
      } catch (error) {
        console.error("Error generating thumbnails:", error);
      }
    };

    fetchThumbnails();
  }, [pdfFile, thumbnailSize]);

  const handleImageClick = () => {
    if (pdfFile) {
      window.open(pdfFile, "_blank"); // Opens the PDF in a new tab
    } else {
      console.error("PDF file URL is not provided.");
    }
  };

  return (
    <div>
      {thumbnails[0]?.thumbnail ? (
        <img
          src={thumbnails[0]?.thumbnail}
          alt={`Thumbnail`}
          className="img-fluid mb-3 cursor-pointer"
          style={{
            width: "100%",
            height: "350px",
            filter: viewedCards ? "blur(4px)" : "none",

            opacity: viewedCards ? 0.9 : 1,
          }}
          onClick={handleImageClick} // Add the click event handler here
        />
      ) : (
        <div
          className="loader d-flex justify-content-center align-content-center"
          style={{ height: "350px" }}
        >
          <div
            class="spinner-border"
            role="status"
            style={{ marginTop: "160px" }}
          >
            <span class="sr-only"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfThumbnails;
