"use client";

import { useEffect, useRef } from "react";

import mapboxgl from "mapbox-gl";

// @ts-expect-error - mapbox-gl doesn't have CSS type declarations
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN_MAP_BOX!;

interface MapBoxProps {
  posix: [number, number];
  zoom?: number;
}

export function MapBox(props: MapBoxProps) {
  const { posix, zoom = 1 } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !posix) return;

    if (!map.current) {
      // Initialize map only once
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/jpcmf/cmnxrzy3h002q01s27rkp93c4",
        center: posix as [number, number],
        zoom
      });
    } else {
      // Update map center when posix changes
      map.current.setCenter(posix as [number, number]);
      map.current.setZoom(zoom);
    }

    // Add or update marker
    if (marker.current) {
      marker.current.setLngLat(posix as [number, number]);
    } else {
      marker.current = new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat(posix as [number, number])
        .addTo(map.current);
    }
  }, [posix, zoom]);

  return <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />;
}
