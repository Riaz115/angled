import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Box } from "@mui/material";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

const API_KEY = "AIzaSyAu1gwHCSzLG9ACacQqLk-LG8oJMkarNF0";

const App = ({ setNodeData, nodeData, lable, bgcolor }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (selectedPlace) {
      const fetchPlaceData = () => {
        if (!selectedPlace.address_components) {
          setTimeout(fetchPlaceData, 100);
          return;
        }

        const getAddressComponent = (type) => {
          const component = selectedPlace.address_components.find((comp) =>
            comp.types.includes(type)
          );
          return component ? component.long_name : "";
        };

        const city =
          getAddressComponent("locality") ||
          getAddressComponent("administrative_area_level_2");
        const state = getAddressComponent("administrative_area_level_1");
        const country = getAddressComponent("country");
        const latitude = selectedPlace.geometry.location.lat();
        const longitude = selectedPlace.geometry.location.lng();

        setNodeData({
          address: selectedPlace.formatted_address,
          city,
          state,
          country,
          latitude,
          longitude,
        });
      };

      fetchPlaceData();
    }
  }, [selectedPlace]);

  return (
    <APIProvider
      apiKey={API_KEY}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Box
        sx={{ position: "relative", zIndex: 9999 }}
        className="autocomplete-container"
      >
        <PlaceAutocomplete
          onPlaceSelect={setSelectedPlace}
          nodeData={nodeData}
          lable={lable}
          bgcolor={bgcolor}
        />
      </Box>
    </APIProvider>
  );
};

const PlaceAutocomplete = ({ onPlaceSelect, nodeData, lable, bgcolor }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address", "address_components"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <Box className="autocomplete-container">
      <input
        ref={inputRef}
        type="text"
        name={"address"}
        placeholder={lable ? lable : "Enter address"}
        className="form-control"
        // value={nodeData?.address || ""}
        style={{
          backgroundColor: bgcolor || "#ffffff",
          // border: "none",
          height: "45px",
          // outline: "none",
        }}
      />
    </Box>
  );
};

// Example usage of App component with dummy props
const root = createRoot(document.getElementById("root"));
root.render(
  <App
    setNodeData={(data) => console.log("Node Data:", data)}
    nodeData={{ location: {} }}
  />
);

export default App;
