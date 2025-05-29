"use client";

import { useEffect, useState } from "react";
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngExpression } from "leaflet";
import { reverseGeocodeAction } from "@/actions";
import { AddressData } from "@/types";

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = new Icon({
	iconUrl: "/marker-icon.png",
	shadowUrl: "/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

// Create a simple custom marker icon
const createCustomIcon = () =>
	new Icon({
		iconUrl:
			"data:image/svg+xml;base64," +
			btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#3B82F6"/>
      <circle cx="12.5" cy="12.5" r="8" fill="white"/>
      <circle cx="12.5" cy="12.5" r="5" fill="#3B82F6"/>
    </svg>
  `),
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
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

// // Component to update map view when center changes
// function ChangeMapView({
// 	center,
// 	zoom,
// }: {
// 	center: LatLngExpression;
// 	zoom: number;
// }) {
// 	const map = useMap();
// 	map.setView(center, zoom);
// 	return null;
// }

export default function AlumniMap({
	isMapping = false,
	initialMarkers,
}: {
	isMapping?: boolean;
	initialMarkers?: {
		name: string;
		avatar: string | null;
		batch: number | null;
		address: AddressData;
	}[];
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

	const customIcon = createCustomIcon();

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
				{initialMarkers &&
					initialMarkers.length > 0 &&
					initialMarkers.map((user, index) => (
						<Marker
							key={`user-${index}`}
							position={[user.address.lat, user.address.lng]}
							icon={customIcon}>
							<Popup closeButton={false} className="custom-popup">
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "12px",
										padding: "8px",
										minWidth: "160px",
										fontFamily: "system-ui, -apple-system, sans-serif",
									}}>
									<div
										style={{
											width: "40px",
											height: "40px",
											borderRadius: "50%",
											backgroundColor: "#3B82F6",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "white",
											fontWeight: "600",
											fontSize: "16px",
										}}>
										{user.name ? user.name.charAt(0).toUpperCase() : "U"}
									</div>
									<div>
										<div
											style={{
												fontWeight: "600",
												fontSize: "14px",
												color: "#1F2937",
												marginBottom: "2px",
											}}>
											{user.name}
										</div>
										{user.batch && (
											<div
												style={{
													fontSize: "12px",
													color: "#6B7280",
												}}>
												Batch {user.batch}
											</div>
										)}
									</div>
								</div>
							</Popup>
						</Marker>
					))}
				{isMapping && <MapClickHandler onMapClick={handleMapClick} />}
			</MapContainer>
			<style jsx global>{`
				.custom-popup .leaflet-popup-content-wrapper {
					border-radius: 8px;
					box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
				}
				.custom-popup .leaflet-popup-content {
					margin: 0;
					padding: 0;
				}
				.custom-popup .leaflet-popup-tip {
					background: white;
				}
			`}</style>
		</div>
	);
}
