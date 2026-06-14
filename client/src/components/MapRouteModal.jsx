import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { X, Navigation, Loader2 } from 'lucide-react';
import axios from 'axios';

// Fix Leaflet marker icons not showing in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle the routing logic inside the MapContainer
function RoutingMachine({ pickupPos, destPos, setRouteDetails }) {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map || !pickupPos || !destPos) return;

        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }

        const control = L.Routing.control({
            waypoints: [
                L.latLng(pickupPos[0], pickupPos[1]),
                L.latLng(destPos[0], destPos[1])
            ],
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: true,
            show: false, // Don't show the default text instructions panel
            lineOptions: {
                styles: [{ color: '#3b82f6', weight: 6, opacity: 0.8 }]
            },
            createMarker: () => null // Hide default routing markers as we use our own
        }).addTo(map);

        control.on('routesfound', function (e) {
            const routes = e.routes;
            const summary = routes[0].summary;

            // Calculate distance in km and time in hours/mins
            const distanceKm = (summary.totalDistance / 1000).toFixed(1);
            const timeHrs = Math.floor(summary.totalTime / 3600);
            const timeMins = Math.floor((summary.totalTime % 3600) / 60);
            const timeStr = timeHrs > 0 ? `${timeHrs}h ${timeMins}m` : `${timeMins}m`;

            setRouteDetails({ distance: distanceKm, time: timeStr });
        });

        routingControlRef.current = control;

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
        };
    }, [map, pickupPos, destPos]);

    return null;
}

export default function MapRouteModal({ isOpen, onClose, request }) {
    const [mounted, setMounted] = useState(false);
    const [pickupPos, setPickupPos] = useState(null);
    const [destPos, setDestPos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [routeDetails, setRouteDetails] = useState({ distance: '...', time: '...' });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch real coordinates using Nominatim (OpenStreetMap's free geocoding API)
    useEffect(() => {
        if (!isOpen || !request) return;

        const fetchCoordinates = async () => {
            setLoading(true);
            setError('');
            try {
                // Geocode Pickup Location
                const pickupUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(request.pickupLocation)}`;
                const pickupRes = await axios.get(pickupUrl);

                // Geocode Destination
                const destUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(request.destination)}`;
                const destRes = await axios.get(destUrl);

                if (pickupRes.data.length > 0 && destRes.data.length > 0) {
                    setPickupPos([parseFloat(pickupRes.data[0].lat), parseFloat(pickupRes.data[0].lon)]);
                    setDestPos([parseFloat(destRes.data[0].lat), parseFloat(destRes.data[0].lon)]);
                } else {
                    setError("Could not find precise coordinates for these locations.");
                }
            } catch (err) {
                console.error("Geocoding error:", err);
                setError("Error fetching map data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCoordinates();
    }, [isOpen, request]);

    if (!isOpen || !request || !mounted) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">

                {/* Header */}
                <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Navigation size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Live Tracking Route</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {request.pickupLocation} ➔ {request.destination}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                {/* Map Container */}
                <div className="flex-1 relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center">

                    {loading && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                            <p className="text-sm font-bold opacity-70">Calculating Real Route...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl max-w-md m-4">
                            <p className="font-bold">{error}</p>
                            <p className="text-xs mt-2 opacity-80">Make sure locations like "{request.pickupLocation}" and "{request.destination}" are valid cities or addresses.</p>
                        </div>
                    )}

                    {!loading && pickupPos && destPos && (
                        <>
                            <MapContainer
                                center={[(pickupPos[0] + destPos[0]) / 2, (pickupPos[1] + destPos[1]) / 2]}
                                zoom={6}
                                scrollWheelZoom={true}
                                style={{ height: '100%', width: '100%', zIndex: 1 }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <Marker position={pickupPos}>
                                    <Popup>
                                        <div className="font-bold text-sm">Pickup: {request.pickupLocation}</div>
                                    </Popup>
                                </Marker>

                                <Marker position={destPos}>
                                    <Popup>
                                        <div className="font-bold text-sm">Destination: {request.destination}</div>
                                    </Popup>
                                </Marker>

                                <RoutingMachine
                                    pickupPos={pickupPos}
                                    destPos={destPos}
                                    setRouteDetails={setRouteDetails}
                                />
                            </MapContainer>

                            {/* Overlay UI inside the map */}
                            <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 dark:bg-black/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 w-64">
                                <h4 className="font-black text-sm mb-3 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">Route Analytics</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="opacity-70 dark:text-gray-300 text-xs font-bold uppercase tracking-wider">Distance</span>
                                        <span className="font-black text-blue-600 dark:text-blue-400">{routeDetails.distance} km</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="opacity-70 dark:text-gray-300 text-xs font-bold uppercase tracking-wider">Est. Time</span>
                                        <span className="font-black text-blue-600 dark:text-blue-400">{routeDetails.time}</span>
                                    </div>
                                    <div className="mt-2 pt-3 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                                        <span className="opacity-70 dark:text-gray-300 text-xs font-bold uppercase tracking-wider">Status</span>
                                        <span className="font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md text-xs uppercase tracking-wider">Searching</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
