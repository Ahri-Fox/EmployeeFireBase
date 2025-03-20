import { LatLngExpression } from 'leaflet'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import './Leaflet.css'
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const getCoordinates = async (address: string) => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
};

const getAddressFromCoords = async (lat: number, lng: number) => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || "Không tìm thấy địa chỉ";
};

const MapUpdater = ({ position }: { position: LatLngExpression }) => {
    const map = useMap();
    map.flyTo(position, 13);
    return null;
};


interface LeafletMapProps {
    onAddressChange?: (address: string) => void; // Callback để truyền địa chỉ lên component cha
    searchAddress?: string; // Địa chỉ tìm kiếm từ bên ngoài
    triggerSearch?: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ onAddressChange, searchAddress, triggerSearch }) => {
    const [address, setAddress] = useState<string>("");
    const [position, setPosition] = useState<LatLngExpression | null>([21.033333, 105.849998]);

    // Effect để xử lý tìm kiếm địa chỉ khi searchAddress thay đổi
    useEffect(() => {
        if (triggerSearch && searchAddress) {
            handleSearch(searchAddress);
        }
    }, [triggerSearch, searchAddress]);

    const ClickHandler = ({ setAddress, setPosition }: any) => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]); // Cập nhật vị trí Marker
                const address = await getAddressFromCoords(lat, lng); // Lấy địa chỉ từ tọa độ
                setAddress(address); // Cập nhật địa chỉ trong LeafletMap
                if (onAddressChange) onAddressChange(address)
            },
        });
        return null;
    };


    const handleSearch = async (address: string) => {
        if (!address.trim()) return alert("Vui lòng nhập địa chỉ!");
        const coords = await getCoordinates(address);
        if (coords) {
            setPosition([coords.lat, coords.lng]); // Cập nhật vị trí bản đồ
            const newAddress = await getAddressFromCoords(coords.lat, coords.lng); // Lấy địa chỉ từ tọa độ
            setAddress(newAddress); // Cập nhật địa chỉ
            if (onAddressChange) onAddressChange(newAddress); // Truyền địa chỉ lên component cha
        } else {
            alert("Không tìm thấy địa chỉ!");
        }
    };

    return (
        <div style={{ textAlign: "center", paddingTop: '20px' }}>
            {/* Bản đồ */}
            <MapContainer center={position || [21.033333, 105.849998]} zoom={13} scrollWheelZoom={false} style={{ height: "250px", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {position && (
                    <>
                        <MapUpdater position={position} />
                        <Marker position={position}>
                            <Popup>Vị trí tìm kiếm</Popup>
                        </Marker>
                    </>
                )}
                <ClickHandler
                    setAddress={(newAddress: string) => {
                        setAddress(newAddress);
                        if (onAddressChange) onAddressChange(newAddress); // Truyền địa chỉ lên component cha
                    }}
                    setPosition={setPosition}
                />
            </MapContainer>
        </div>
    );
};

export default LeafletMap;