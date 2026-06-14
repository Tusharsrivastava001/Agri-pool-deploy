import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapWidget = ({ locations }) => {
    return (
        <div className="h-64 w-full rounded-2xl overflow-hidden shadow-xl border border-white/20 z-0">
            <MapContainer center={[20.5937, 78.9629]} zoom={4} className="h-full w-full z-0">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                {locations?.map((loc, idx) => (
                    <Marker key={idx} position={[loc.lat, loc.lng]}>
                        <Popup>{loc.title}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapWidget;
