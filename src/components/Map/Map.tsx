import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import { Marker, Popup } from 'react-leaflet';
import * as mapService from '../../services/mapService';
import { Fountain } from '../../types/models';
import { debounce } from 'lodash';

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([30.266666, -97.733330]);
  const [fountains, setFountains] = useState<Fountain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const locationEnabled = Boolean(navigator.geolocation);
  isLoading? null:null

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

    async function fetchFountains(location: [number, number]) {
      try {
        setIsLoading(true);

        const radius = 5;
        const response = await mapService.getFountains(location[0], location[1], radius);
        const foundFountains = typeof response === 'string' ? JSON.parse(response) : response;
        const nodeList = foundFountains.elements;

        setFountains(nodeList);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching fountains:', error);
        setIsLoading(false);
      }
    }

    debouncedFetchFountains(currentLocation);

    return () => {
      // Cleanup the debounced function
      debouncedFetchFountains.cancel();
    };
  }, [currentLocation]);

  function MapView() {
    const map = useMap();

    const handleMapMove = () => {
      const center = map.getCenter();
      const newLocation: [number, number] = [center.lat, center.lng];
      setCurrentLocation(newLocation);
    };

    useMapEvents({
      moveend: handleMapMove,
    });

    return null;
  }

  return (
    <>
      {!locationEnabled && <h3>You Must Have Location Services Enabled to Use This App</h3>}
      {/* {console.log(isLoading)} FIX THIS TO NOT BE A CONSOLE LOG */}
      <MapContainer center={currentLocation} zoom={13} style={{ height: '400px' }}>
        <MapView />
        {/* <Marker position={currentLocation} /> */}
        {
          <>
            {fountains?.map((fountain) => (
              <Marker key={fountain.id} position={[fountain.lat, fountain.lon]}>
                <Popup>
                  <h3>{JSON.stringify(fountain.tags)}</h3>
                </Popup>
              </Marker>
            ))}
          </>
        }
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </>
  );
};

export default Map;
