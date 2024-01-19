import * as React from "react";
import Head from "next/head";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function ReactMaps() {
  const [currentPosition, setCurrentPosition] = React.useState({
    latitude: null,
    longitude: null,
  });

  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  return (
    <div>
      {currentPosition.latitude != null &&
        currentPosition.longitude != null && (
          <Map
            initialViewState={{
              latitude: currentPosition.latitude,
              longitude: currentPosition.longitude,
              zoom: 14,
            }}
            style={{ width: "100vw", height: "100vh" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          >
            <Marker
              longitude={currentPosition.longitude}
              latitude={currentPosition.latitude}
              color="red"
            />
          </Map>
        )}
    </div>
  );
}
