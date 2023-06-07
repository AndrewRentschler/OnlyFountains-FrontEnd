import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Marker, Popup } from 'react-leaflet';
import * as mapService from '../../services/mapService';
import { Fountain } from '../../types/models';




const Map = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([30.266666, -97.733330]);
  const [fountains, setFountains] = useState<Fountain[]>([]); // Update the initial state for fountains

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

  useEffect(() => {
    console.log(fountains, 'fountains')
    async function fetchFountains() {
      console.log('fetching fountains');
      try {
        const radius = 5;
        console.log('trying to get fountains')
        const response = await mapService.getFountains(currentLocation[0], currentLocation[1], radius);
        console.log('response')
        const foundFountains = typeof response === 'string' ? JSON.parse(response) : response;
        // console.log(foundFountains.elements, 'foundFountains')
        const nodeList = foundFountains.elements;
        // console.log(nodeArray, 'nodeArray')
        setFountains(nodeList);
      } catch (error) {
        console.log(error, 'error');
      }
    }
    fetchFountains();
    console.log(fountains, "fountains") // Call the fetchFountains function inside the useEffect
  }, [currentLocation, fountains]);

  function SetViewToCurrentLocation() {
    const map = useMap();
    map.setView(currentLocation, map.getZoom());
    return null;
  }

  return (
    <>
      {!locationEnabled ? <h3>You Must Have Location Services Enabled to Use This App</h3> : null}
      <MapContainer center={currentLocation} zoom={13} style={{ height: '400px' }}>
        <Marker position={currentLocation}></Marker>
        {fountains.length > 0 && (
          <>
            {fountains.map((fountain) => (
              <Marker key={fountain.id} position={[fountain.lat, fountain.lon]}>
                <Popup key={fountain.id}>
                  {/* <h3>{JSON.stringify(fountain.tags)}</h3> */}
                </Popup>
              </Marker>
            ))}
          </>
        )}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </>
  );
};

export default Map;
