import { routeData } from "@/data/response";
import React, { useState, useEffect } from "react";
import ReactMapGL, {
  Marker,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl";
import _debounce from "lodash/debounce";
import { LocateIcon } from "lucide-react";

const MapComponent = () => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: 400,
    latitude: 19.221542,
    longitude: 73.164539,
    zoom: 13,
  });
  const setViewportDebounced = _debounce((newViewport) => {
    setViewport(newViewport);
  }, 200); //for avoiding setSTate error

  const handleMove = (newViewport) => {
    setViewportDebounced(newViewport);
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onMove={(newViewport) => handleMove(newViewport)}
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* Display the route */}
      <Marker
        longitude={73.164539}
        latitude={19.221542}
        offsetTop={-10}
        offsetLeft={-10}
      >
        {/* You can customize the marker, e.g., with an SVG marker */}
        <div style={{ fontSize: "24px", color: "red" }}>🚗</div>
      </Marker>
      {routeData.waypoints.map(
        (waypoint, index) =>
          // Check if the waypoint is not the starting point
          index > 0 && (
            <Marker
              key={index}
              longitude={waypoint.location[0]}
              latitude={waypoint.location[1]}
            >
              <LocateIcon />
            </Marker>
          )
      )}

      {/* Draw the route line */}
      {routeData.routes.map((route, index) => (
        <Source
          key={`route-${index}`}
          id={`route-${index}`}
          type="geojson"
          data={{
            type: "Feature",
            properties: {},
            geometry: route.geometry,
          }}
        >
          <Layer
            id={`route-${index}`}
            type="line"
            source={`route-${index}`}
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "#888",
              "line-width": 8,
            }}
          />
        </Source>
      ))}

      {/* Add navigation controls */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          padding: "10px",
        }}
      >
        <NavigationControl showCompass={true} />
      </div>
    </ReactMapGL>
  );
};

export default MapComponent;
