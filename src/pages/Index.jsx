import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import { Container, Input, Button, VStack, Box } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationMarker = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const Index = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState(null);
  const [locationName, setLocationName] = useState("");

  const handleMapClick = (latlng) => {
    setNewLocation(latlng);
  };

  const handleSubmit = () => {
    if (locationName.trim() !== "") {
      setLocations([...locations, { ...newLocation, name: locationName }]);
      setNewLocation(null);
      setLocationName("");
    }
  };

  return (
    <Container maxW="100vw" height="100vh" p={0}>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onClick={handleMapClick} />
        {locations.map((loc, idx) => (
          <Marker key={idx} position={[loc.lat, loc.lng]} draggable>
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}
        {newLocation && (
          <Marker position={[newLocation.lat, newLocation.lng]}>
            <Popup>
              <VStack spacing={2}>
                <Input
                  placeholder="Location Name"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
                <Button onClick={handleSubmit}>Submit</Button>
              </VStack>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Container>
  );
};

export default Index;