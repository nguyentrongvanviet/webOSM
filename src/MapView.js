import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function MapView({ center, zoom, pointsOfInterest, weatherMarker }) {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%', minHeight: '500px' }}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      
      {pointsOfInterest.map((poi) => (
        <Marker key={poi.id} position={[poi.lat, poi.lon]}>
          <Popup>
            <div className="popup-content">
              <h3>{poi.name}</h3>
              <p><strong>Loại:</strong> {poi.type}</p>
              <p><strong>Tọa độ:</strong> {poi.lat.toFixed(4)}, {poi.lon.toFixed(4)}</p>
            </div>
          </Popup>
        </Marker>
      ))}

            {weatherMarker && (
              <Marker position={[weatherMarker.lat, weatherMarker.lon]}>
                <Tooltip permanent direction="top" offset={[0, -20]} className="weather-tooltip">
                  <div className="weather-tooltip-content">
                    <strong>{weatherMarker.temperature}</strong>
                    <span>{weatherMarker.description}</span>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="popup-content">
                    <h3>Thời tiết tại {weatherMarker.name}</h3>
                    <p><strong>Nhiệt độ:</strong> {weatherMarker.temperature}</p>
                    <p><strong>Cảm nhận:</strong> {weatherMarker.feelsLike}</p>
                    <p><strong>Độ ẩm:</strong> {weatherMarker.humidity}</p>
                    <p><strong>Gió:</strong> {weatherMarker.wind}</p>
                  </div>
                </Popup>
              </Marker>
            )}
    </MapContainer>
  );
}

export default MapView;
