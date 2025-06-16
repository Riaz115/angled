import { Box, Button } from '@mui/material';
import React, { useRef } from 'react';
import { Col } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaTrash, FaUpload } from 'react-icons/fa';
import PdfThumbnails from '../../../components/PdfThumbnails';

const EditFile = ({ viewedCards, handleEyeIconClick, index, card, docfile, handleUpload }) => {


    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {

        handleUpload(event); // Pass the selected files to the parent

    };

    // console.log(docfile,"this is doc file")
    return (
        <Col md={5} lg={4} className="d-flex flex-column align-items-center">
            <div
    className="w-75 border"
    style={{
        position: 'relative',
        height: '350px',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'filter 0.3s ease',
    }}
>
    {/* Image Tag */}
    {docfile ? (
        typeof docfile === 'string' && docfile.startsWith('https://') ? (
            // Handle AWS file URL
            docfile.includes('.pdf') ? (
                <PdfThumbnails
                    pdfFile={docfile}
                    viewedCards={viewedCards[index]}
                    pageIndex={0}
                />
            ) : (
                <img
                    src={docfile}
                    alt={card.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover', // Ensure it fully covers the div
                        filter: viewedCards[index] ? 'blur(4px)' : 'none',
                        opacity: viewedCards[index] ? 0.9 : 1,
                    }}
                />
            )
        ) : docfile?.type === 'application/pdf' ? (
            <PdfThumbnails
                viewedCards={viewedCards[index]}
                pdfFile={URL.createObjectURL(docfile)}
                pageIndex={0}
            />
        ) : (
            <img
                src={URL.createObjectURL(docfile)}
                alt={card.title}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', 
                    filter: viewedCards[index] ? 'blur(4px)' : 'none',
                    opacity: viewedCards[index] ? 0.9 : 1,
                }}
            />
        )
    ) : (
        <img
            src="https://via.placeholder.com/240x300"
            alt="Verification"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', // Ensure it fully covers the div
                filter: viewedCards[index] ? 'blur(4px)' : 'none',
                opacity: viewedCards[index] ? 0.9 : 1,
            }}
        />
    )}

    {/* Eye Icon */}
    <div
        style={{
            position: 'absolute',
            top: '10px',
            display: 'flex',
            justifyContent: 'end',
            width: '100%',
            padding: '0 10px',
        }}
    >
        {viewedCards[index] ? (
            <FaEyeSlash
                size={20}
                style={{
                    color: 'white',
                    cursor: 'pointer',
                }}
                onClick={() => handleEyeIconClick(index)}
            />
        ) : (
            <FaEye
                size={20}
                style={{
                    color: 'white',
                    cursor: 'pointer',
                }}
                onClick={() => handleEyeIconClick(index)}
            />
        )}
    </div>

    {/* Bottom Overlay */}
    <div
        style={{
            backgroundColor: '#FFFFFFCC',
            width: '90%',
            height: '50px',
            position: 'absolute',
            bottom: '10px',
            left: '15px',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '15px',
        }}
    >
        <p
            style={{
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: '400',
                textAlign: 'left',
            }}
        >
            {card.title}
        </p>
        <div
            style={{
                fontFamily: 'Poppins',
                fontSize: '12px',
                fontWeight: '500',
                textAlign: 'center',
                padding: '8px',
                border: '1px solid black',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            File
        </div>
    </div>
</div>


            {/* Card content */}
            <div className="d-flex justify-content-end w-75 mt-4">
                {/* <Button variant="light" size="sm" className="me-2" style={{ backgroundColor: 'transparent' }}>
                    <FaTrash style={{ marginRight: '8px' }} /> Remove
                </Button> */}
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                       
                    accept="image/*,application/pdf"
                    />
                    <Button
                        sx={{
                            color: "black",
                            border: "1px solid #858687",
                            backgroundColor: "transparent",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#f2f2f2",
                            },
                        
                        }}
                        className="px-4 d-flex justify-content-between"
                        onClick={handleButtonClick}
                    >
                        <span>Upload</span>
                        <FaUpload className='ms-3'/>
                    </Button>
                </div>

            </div>
        </Col>
    );
};

export default EditFile;
