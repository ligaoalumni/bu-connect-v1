"use server";

const NOMINATIM_API_URL = "https://nominatim.openstreetmap.org";

export interface GeocodingResult {
	place_id: number;
	lat: string;
	lon: string;
	display_name: string;
	address: {
		road?: string;
		city?: string;
		state?: string;
		country?: string;
		postcode?: string;
		[key: string]: string | undefined;
	};
	boundingbox: string[];
}

// Helper to format the result to our internal format
export interface FormattedGeocodingResult {
	formatted: string;
	geometry: {
		lat: number;
		lng: number;
	};
	components: {
		country?: string;
		city?: string;
		state?: string;
		postcode?: string;
		road?: string;
		[key: string]: string | undefined;
	};
	confidence: number;
	place_id: number;
}

// Add delay to respect Nominatim usage policy
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Format Nominatim result to our internal format
function formatNominatimResult(
	result: GeocodingResult
): FormattedGeocodingResult {
	return {
		formatted: result.display_name,
		geometry: {
			lat: Number.parseFloat(result.lat),
			lng: Number.parseFloat(result.lon),
		},
		components: result.address || {},
		confidence: 1, // Nominatim doesn't provide confidence score
		place_id: result.place_id,
	};
}

// Forward geocoding: Convert address to coordinates
export async function geocodeAddressAction(
	address: string
): Promise<FormattedGeocodingResult[]> {
	try {
		const response = await fetch(
			`${NOMINATIM_API_URL}/search?q=${encodeURIComponent(
				address
			)}&format=json&addressdetails=1&limit=5`,
			{
				headers: {
					"User-Agent": "AlumniMapApplication/1.0",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Geocoding failed: ${response.statusText}`);
		}

		const data: GeocodingResult[] = await response.json();

		// Add delay to respect usage policy
		await delay(1000);

		return data.map(formatNominatimResult);
	} catch (error) {
		console.error("Geocoding error:", error);
		return [];
	}
}

// Reverse geocoding: Convert coordinates to address
export async function reverseGeocodeAction(
	lat: number,
	lng: number
): Promise<FormattedGeocodingResult | null> {
	try {
		console.log(lat, lng, "lat lng");
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
		);

		if (!response.ok) {
			throw new Error(`Reverse geocoding failed: ${response.statusText}`);
		}

		const data: GeocodingResult = await response.json();

		// Add delay to respect usage policy
		await delay(1000);

		return formatNominatimResult(data);
	} catch (error) {
		console.error("Reverse geocoding error:", error);
		return null;
	}
}
