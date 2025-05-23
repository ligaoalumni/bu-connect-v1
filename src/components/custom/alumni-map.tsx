"use client";

import { useEffect, useState } from "react";
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
	useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngExpression } from "leaflet";
import { reverseGeocodeAction } from "@/actions";

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = new Icon({
	iconUrl: "/marker-icon.png",
	shadowUrl: "/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

function MapClickHandler({
	onMapClick,
}: {
	onMapClick: (lat: number, lng: number) => void;
}) {
	useMapEvents({
		click: (e) => {
			onMapClick(e.latlng.lat, e.latlng.lng);
		},
	});
	return null;
}

// Component to update map view when center changes
function ChangeMapView({
	center,
	zoom,
}: {
	center: LatLngExpression;
	zoom: number;
}) {
	const map = useMap();
	map.setView(center, zoom);
	return null;
}

export default function AlumniMap({
	isMapping = false,
}: {
	isMapping?: boolean;
	initialMarkers?: LatLngExpression[];
}) {
	// Use state to track if component is mounted (client-side)
	const [center, setCenter] = useState<LatLngExpression>([
		13.2017724, 123.6404747,
	]);
	const [zoom, setZoom] = useState(13);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		// Optional: You can add cleanup if needed
		return () => {
			setIsMounted(false);
		};
	}, []);

	// Only render the map on the client side
	if (!isMounted) {
		return (
			<div className="h-[400px] w-full bg-muted flex items-center justify-center">
				Loading map...
			</div>
		);
	}

	const handleMapClick = async (lat: number, lng: number) => {
		const data = await reverseGeocodeAction(lat, lng);
		console.log(data, " qqq");
	};

	return (
		<div className="h-[400px] w-full rounded-md overflow-hidden border">
			<MapContainer
				center={center}
				zoom={zoom}
				scrollWheelZoom={false}
				style={{ height: "100%", width: "100%" }}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={[51.505, -0.09]} icon={defaultIcon}>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable.
					</Popup>
				</Marker>
				{isMapping && <MapClickHandler onMapClick={handleMapClick} />}
			</MapContainer>
		</div>
	);
}
