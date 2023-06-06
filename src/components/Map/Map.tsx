import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Marker } from 'react-leaflet';


interface MapProps {
  defaultLatitude: number;
  defaultLongitude: number;
}

const Map: React.FC<MapProps> = ({ defaultLatitude, defaultLongitude }) => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([defaultLatitude, defaultLongitude]);
  const locationEnabled = Boolean(navigator.geolocation);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  }, []);

  const SetViewToCurrentLocation = () => {
    const map = useMap();
    map.setView(currentLocation, map.getZoom());
    return null;
  };

  return (
    <>
      {!locationEnabled ? <h3>You Must Have Location Services Enabled to Use This App</h3>:null}
      <MapContainer center={currentLocation} zoom={13} style={{ height: '400px' }}>
        <SetViewToCurrentLocation />
        <Marker position={currentLocation}></Marker>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </>
  );
};

export default Map;