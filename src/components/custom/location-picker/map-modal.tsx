"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Icon, type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Navigation } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { geocodeAddressAction, reverseGeocodeAction } from "@/actions";
import { AddressData } from "@/types";

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/5216/5216405.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Map click handler component
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

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: AddressData) => void;
  initialAddress?: AddressData;
}

export function MapModal({
  open,
  onOpenChange,
  onSave,
  initialAddress,
}: MapModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [center, setCenter] = useState<LatLngExpression>(
    initialAddress
      ? [initialAddress.lat, initialAddress.lng]
      : [14.5995, 120.9842], // Default to Manila
  );
  const [zoom, setZoom] = useState(13);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialAddress ? [initialAddress.lat, initialAddress.lng] : null,
  );
  const [address, setAddress] = useState(initialAddress?.address || "");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reference to the map instance
  const mapRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      if (initialAddress) {
        setCenter([initialAddress.lat, initialAddress.lng]);
        setMarkerPosition([initialAddress.lat, initialAddress.lng]);
        setAddress(initialAddress.address);
      } else {
        setMarkerPosition(null);
        setAddress("");
      }
      setError(null);
    }
  }, [open, initialAddress]);

  const handleMapClick = async (lat: number, lng: number) => {
    // Update both marker position and center when clicking
    setMarkerPosition([lat, lng]);
    setCenter([lat, lng]);
    setIsLoading(true);
    setError(null);

    try {
      // Use the server action for reverse geocoding
      const result = await reverseGeocodeAction(lat, lng);

      if (result) {
        setAddress(result.formatted);
      } else {
        throw new Error("Could not retrieve address information");
      }
    } catch (error) {
      console.error("Error getting address:", error);
      setError("Could not retrieve address information");
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use the server action for geocoding
      const results = await geocodeAddressAction(searchQuery);

      if (results.length === 0) {
        setError("No results found for this search");
        return;
      }

      const result = results[0];
      const newPosition: [number, number] = [
        result.geometry.lat,
        result.geometry.lng,
      ];

      setCenter(newPosition);
      setZoom(16);
      setMarkerPosition(newPosition);
      setAddress(result.formatted);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search for this location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
        setZoom(16);
        setMarkerPosition([latitude, longitude]);

        try {
          // Use the server action for reverse geocoding
          const result = await reverseGeocodeAction(latitude, longitude);

          if (result) {
            setAddress(result.formatted);
          } else {
            throw new Error("Could not retrieve address information");
          }
        } catch (error) {
          console.error("Error getting address:", error);
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        let errorMessage = "Failed to get your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleSave = () => {
    if (!markerPosition) {
      setError("Please select a location on the map");
      return;
    }

    onSave({
      lat: markerPosition[0],
      lng: markerPosition[1],
      address: address,
    });

    onOpenChange(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleSearch}
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="h-[300px] w-full rounded-md overflow-hidden border">
            <MapContainer
              center={center}
              zoom={zoom}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
              // whenCreatedwh={(map) => {
              // 	// Store the map instance in the ref
              // 	mapRef.current = map;
              // }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {markerPosition && (
                <Marker position={markerPosition} icon={defaultIcon} />
              )}

              <MapClickHandler onMapClick={handleMapClick} />

              {/* Remove the ChangeMapView component that was causing the issue */}
            </MapContainer>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address will appear here after selecting a location"
              readOnly={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {markerPosition && markerPosition[0] && markerPosition[1]
                ? `Coordinates: ${markerPosition[0].toFixed(
                    6,
                  )}, ${markerPosition[1].toFixed(6)}`
                : "Click on the map to select a location"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!markerPosition || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Save Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
