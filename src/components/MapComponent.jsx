import { routeData } from "@/data/response";
import { res2 } from "@/data/res2";
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

  const [busPositionIndex, setBusPositionIndex] = useState(0);

  const simulateBusMovement = () => {
    setBusPositionIndex(
      (prevIndex) => (prevIndex + 1) % routeData.waypoints.length
    );

    setTimeout(simulateBusMovement, 2000);
  };

  useEffect(() => {
    // Start the simulation when the component mounts
    simulateBusMovement();

    // Clean up the simulation when the component unmounts
    return () => {
      clearTimeout();
    };
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onMove={(newViewport) => handleMove(newViewport)}
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* Marker for bus location */}
      <Marker
        longitude={routeData.waypoints[busPositionIndex].location[0]}
        latitude={routeData.waypoints[busPositionIndex].location[1]}
        offsetTop={-10}
        offsetLeft={-10}
      >
        <div style={{ fontSize: "24px", color: "red" }}>🚗</div>
      </Marker>
      {routeData.waypoints.map(
        (waypoint, index) =>
          // for ignoring the starting point
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

      {/* Drwaing the navigation Line */}
      {/* {routeData.routes.map((route, index) => (
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
      ))} */}

      {/* Drawing the navigation Line for the full path */}
      {routeData.routes.map((route, index) => (
        <Source
          key={`full-route-${index}`}
          id={`full-route-${index}`}
          type="geojson"
          data={{
            type: "Feature",
            properties: {},
            geometry: route.geometry,
          }}
        >
          <Layer
            id={`full-route-${index}`}
            type="line"
            source={`full-route-${index}`}
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "blue",
              "line-width": 8,
            }}
          />
        </Source>
      ))}

      {/* Drawing the navigation Line for the traveled path */}
      {res2.routes.map((route, index) => (
        <Source
          key={`traveled-route-${index}`}
          id={`traveled-route-${index}`}
          type="geojson"
          data={{
            type: "Feature",
            properties: {},
            geometry: route.geometry,
          }}
        >
          <Layer
            id={`traveled-route-${index}`}
            type="line"
            source={`traveled-route-${index}`}
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "gray", // Choose a color for the traveled path
              "line-width": 8, // Adjust line width if needed
            }}
          />
        </Source>
      ))}

      {/* {res2.routes.map((route, index) => (
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
      ))} */}

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
