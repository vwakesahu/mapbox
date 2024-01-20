import { routeData } from "@/data/response";
import React, { useState, useEffect } from "react";
import ReactMapGL, {
  Marker,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl";
import _debounce from "lodash/debounce";
// import { res2 } from "@/data/res2";
const MapComponent = () => {
  const coords = routeData.routes[0].geometry.coordinates;
  const [viewport, setViewport] = useState({
    width: "100%",
    height: 400,
    latitude: 19.221542,
    longitude: 73.164539,
    zoom: 13,
  });

  const [path2, setPath2] = useState({
    routes: [
      {
        geometry: {
          coordinates: [],
        },
      },
    ],
  });

  const pushElementsIntoArray = (array, index) => {
    let arr = [];
    for (let i = 0; i < index; i++) {
      arr = [...arr, array[i]];
    }
    return arr;
  };

  const pathTravelled = (key, array) => {
    for (let index = 0; index < array.length; index++) {
      if (array[index][0] === key[0] && array[index][1] === key[1]) {
        return pushElementsIntoArray(coords, index);
      }
    }
    return -1;
  };

  const [busPositionIndex, setBusPositionIndex] = useState(0);

  const setViewportDebounced = _debounce((newViewport) => {
    setViewport(newViewport);
  }, 200);

  const handleMove = (newViewport) => {
    setViewportDebounced(newViewport);
  };

  useEffect(() => {
    const key = routeData.waypoints[busPositionIndex].location;

    setPath2({
      routes: [{ geometry: { coordinates: [...pathTravelled(key, coords)] } }],
    });
  }, [busPositionIndex]);

  const simulateBusMovement = () => {
    setBusPositionIndex(
      (prevIndex) => (prevIndex + 1) % routeData.waypoints.length
    );

    setTimeout(simulateBusMovement, 500);
  };

  useEffect(() => {
    simulateBusMovement();

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
      <Source
        key="traveled-route"
        id="traveled-route"
        type="geojson"
        data={{
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates:
              path2.routes.length > 0
                ? path2.routes[0].geometry.coordinates
                : [],
          },
        }}
      >
        <Layer
          id="traveled-route"
          type="line"
          source="traveled-route"
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
          paint={{
            "line-color": "gray",
            "line-width": 8,
          }}
        />
      </Source>

      <div style={{ position: "absolute", top: 0, left: 0, padding: "10px" }}>
        <NavigationControl showCompass={true} />
      </div>
    </ReactMapGL>
  );
};

export default MapComponent;
