import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import { Marker, Popup } from 'react-leaflet';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import * as mapService from '../../services/mapService';
import { Fountain } from '../../types/models';
import { debounce } from 'lodash';
import { User } from '../../types/models';
import RatingComponent from '../RatingComponent/RatingComponent';

interface MapProps {
  user: User | null;
}

function Map(mapProps: MapProps) {
  const { user } = mapProps;
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([30.266666, -97.733330]);
  const [fountains, setFountains] = useState<Fountain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const locationEnabled = Boolean(navigator.geolocation);
  isLoading ? null : null;

  // Retrieve the current location
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

  // Fetch fountains within the visible map area
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
      debouncedFetchFountains.cancel();
    };
  }, [currentLocation]);

  const handleRouteClick = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    window.open(url, '_blank');
  };
  
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
      <MapContainer center={currentLocation} zoom={13} style={{ height: '80%' }}>
        <MapView />
        {fountains?.map((fountain) => (
          <Marker key={fountain.id} position={[fountain.lat, fountain.lon]}>
            <Popup>
              <p>Lat: {fountain.lat}</p>
              <p>Lon: {fountain.lon}</p>
              {user ? <RatingComponent fountain={fountain} profileId={user.profile.id}/> : null}
              <Tooltip title="Opens in new tab">
                <Button onClick={() => handleRouteClick(fountain.lat, fountain.lon)}>
                  Open Route
                </Button>
              </Tooltip>
            </Popup>
          </Marker>
        ))}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </>
  );
}

export default Map;
