import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Marker, Popup } from 'react-leaflet';
import * as mapService from '../../services/mapService';
import { Fountain } from '../../types/models';
import { debounce } from 'lodash';

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([30.266666, -97.733330]);
  const [fountains, setFountains] = useState<Fountain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    const debouncedFetchFountains = debounce(fetchFountains, 500);

    async function fetchFountains() {
      try {
        setIsLoading(true);

        const radius = 5;
        const response = await mapService.getFountains(currentLocation[0], currentLocation[1], radius);
        const foundFountains = typeof response === 'string' ? JSON.parse(response) : response;
        const nodeList = foundFountains.elements;

        setFountains(nodeList);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching fountains:', error);
        setIsLoading(false);
      }
    }

    debouncedFetchFountains();

    return () => {
      // Cleanup the debounced function
      debouncedFetchFountains.cancel();
    };
  }, [currentLocation]);

  function SetViewToCurrentLocation() {
    const map = useMap();
    map.setView(currentLocation, map.getZoom());
    return null;
  }

  return (
    <>
      {!locationEnabled && <h3>You Must Have Location Services Enabled to Use This App</h3>}
      {isLoading && <h3>Loading...</h3>}
      <MapContainer center={currentLocation} zoom={13} style={{ height: '400px' }}>
        <SetViewToCurrentLocation />
        <Marker position={currentLocation} />
        {fountains.length > 0 && (
          <>
            {fountains.map((fountain) => (
              <Marker key={fountain.id} position={[fountain.lat, fountain.lon]}>
                <Popup>
                  <h3>{JSON.stringify(fountain.tags)}</h3>
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
