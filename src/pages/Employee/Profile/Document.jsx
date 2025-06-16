import React, { useEffect, useState } from "react";
import { FaEllipsisV, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiEdit2Fill, RiDeleteBin6Line } from "react-icons/ri";
import { Menu, MenuItem } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import PdfThumbnails from "../../../components/PdfThumbnails";
import { Modal } from "react-bootstrap";

const Document = ({ setIsEditingDocument, setEditCardData, userprofile }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [viewedCards, setViewedCards] = useState({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const [doc, setDoc] = useState({
    certification: null,
    driver_license: null,
    other_documents: null,
    professional_license: null,
    resume: null,
  });

  useEffect(() => {
    setDoc({
      certification: userprofile?.certification,
      driver_license: userprofile?.driver_license,
      other_documents: userprofile?.other_documents,
      professional_license: userprofile?.professional_license,
      resume: userprofile?.resume,
    });
  }, [userprofile]);

  const cardsData = [
    { id: 1, title: "Resume", filedata: userprofile?.resume?.file },
    {
      id: 2,
      title: "Certifications",
      filedata: userprofile?.certification?.file,
    },
    {
      id: 3,
      title: "Driver’s License",
      filedata: userprofile?.driver_license?.file,
    },
    {
      id: 4,
      title: "Professional License",
      filedata: userprofile?.professional_license?.file,
    },
    {
      id: 5,
      title: "Additional Document",
      filedata: userprofile?.other_documents?.file,
    },
  ];

  const handleMenuOpen = (event, cardIndex) => {
    console.log(cardIndex, "this is index of card");
    setAnchorEl(event.currentTarget);
    setActiveCard(cardIndex);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    if (action === "edit") {
      setEditCardData(cardsData[activeCard]);
      setIsEditingDocument(true);
    }
    setAnchorEl(null);
  };

  const handleEyeIconClick = (index) => {
    console.log(index, "this is index");
    setViewedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleImageClick = (filedata) => {
    setModalImage(filedata);
    setShowModal(true);
  };

  return (
    <div className="container-fluid mt-5">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {cardsData.map((card, index) => (
          <div
            key={card.id}
            style={{
              borderRadius: "15px",
            }}
          >
            {card.filedata && (
              <h3
                style={{
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  fontWeight: "500",
                  lineHeight: "30px",
                  letterSpacing: "0.01em",
                  textAlign: "left",
                  color: "#2F80ED",
                  marginBottom: "8px",
                }}
              >
                {card.title}
              </h3>
            )}
            {card.filedata && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "350px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  transition: "filter 0.3s ease",
                }}
              >
                {/* Image or PDF Display */}
                {card?.filedata ? (
                  typeof card?.filedata === "string" &&
                  card?.filedata.startsWith("https://") ? (
                    // Handle AWS file URL
                    card?.filedata.includes(".pdf") ? (
                      <PdfThumbnails
                        pdfFile={card?.filedata}
                        viewedCards={viewedCards[index]}
                        pageIndex={0}
                      />
                    ) : (
                      <img
                        className="cursor-pointer"
                        src={card?.filedata}
                        alt={card.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // Ensures full coverage of the div
                          filter: viewedCards[index] ? "blur(4px)" : "none",
                          opacity: viewedCards[index] ? 0.9 : 1,
                        }}
                        onClick={() => handleImageClick(card.filedata)}
                      />
                    )
                  ) : // Handle file uploaded directly from local
                  card?.filedata?.type === "application/pdf" ? (
                    <PdfThumbnails
                      pdfFile={URL.createObjectURL(card?.filedata)}
                      viewedCards={viewedCards[index]}
                      pageIndex={0}
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(card?.filedata)}
                      alt={card.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // Ensures full coverage of the div
                        filter: viewedCards[index] ? "blur(4px)" : "none",
                        opacity: viewedCards[index] ? 0.9 : 1,
                      }}
                    />
                  )
                ) : (
                  <img
                    src="https://via.placeholder.com/240x300"
                    alt="Verification"
                    style={{
                      width: "100%",
                      height: "350px",
                      objectFit: "cover",
                      filter: viewedCards[index] ? "blur(4px)" : "none",
                      opacity: viewedCards[index] ? 0.9 : 1,
                    }}
                  />
                )}

                {/* Eye Icon */}
                <div
                  style={{
                    zIndex: 10, // Ensure this element is above others
                    position: "absolute",
                    top: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0 10px",
                    cursor: "pointer",
                  }}
                >
                  <FaEllipsisV
                    size={20}
                    style={{
                      fontSize: "18px",
                      color: "black",
                      cursor: "pointer",
                    }}
                    onClick={(event) => handleMenuOpen(event, index)}
                  />
                  {viewedCards[index] ? (
                    <FaEye
                      size={20}
                      style={{
                        fontSize: "18px",
                        color: "black",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEyeIconClick(index)}
                    />
                  ) : (
                    <FaEyeSlash
                      size={20}
                      style={{
                        fontSize: "18px",
                        color: "black",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEyeIconClick(index)}
                    />
                  )}
                </div>

                {/* Bottom Overlay */}
                <div
                  style={{
                    backgroundColor: "#FFFFFFCC",
                    width: "90%",
                    height: "50px",
                    position: "absolute",
                    bottom: "10px",
                    left: "15px",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      textAlign: "left",
                    }}
                  >
                    {card.title}
                  </p>
                  <div
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "12px",
                      fontWeight: "500",
                      lineHeight: "19.5px",
                      color: "black",
                      letterSpacing: "0.01em",
                      textAlign: "center",
                      padding: "8px",
                      border: "1px solid black",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    File
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => handleMenuAction("edit")}
          disableRipple
          sx={{
            display: "flex",
            alignItems: "center",
            // color: "black",
            gap: "8px",
            color: "#0044ff",
            "&:hover": {
              backgroundColor: "#E7F0FA",
            },
          }}
        >
          <RiEdit2Fill style={{ fontSize: "18px" }} />
          Edit
        </MenuItem>
        {/* <MenuItem
          onClick={ () => handleMenuAction( 'delete' ) }
          disableRipple
          sx={ {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'red',
            '&:hover': {

              backgroundColor: '#E7F0FA',
            },
          } }
        >
          <RiDeleteBin6Line style={ { fontSize: '18px' } } />
          Delete
        </MenuItem> */}
      </Menu>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalImage && (
            <img
              src={modalImage}
              alt="Preview"
              style={{ width: "100%", height: "auto", borderRadius: "10px" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Document;
