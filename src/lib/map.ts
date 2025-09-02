type LatLng = { lat: number; lng: number };

// Fungsi untuk menghitung jarak (meter) antara dua titik latitude/longitude pakai rumus Haversine
function distanceBetween(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (x: number) => (x * Math.PI) / 180;

    const R = 6371000; // Radius bumi dalam meter
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function getPosisi(): { jarak: number; pos: LatLng } {
    const pos2: LatLng = { lat: -6.258774, lng: 106.868135 };

    let lat: number;
    let lng: number;
    let jarak = 10000000;

    do {
        // Generate random lat offset
        let randLat = Math.random() * 10000;
        randLat = (randLat - (randLat % 1)) / 10000000;
        lat = pos2.lat + randLat;

        // Generate random lng offset
        let randLng = Math.random() * 10000;
        randLng = (randLng - (randLng % 1)) / 10000000;
        lng = pos2.lng + randLng;

        jarak = distanceBetween(lat, lng, pos2.lat, pos2.lng);
    } while (jarak >= 50);

    return {
        jarak: Math.floor(jarak),
        pos: { lat, lng },
    };
}

export async function getAddress(lat: number, lng: number): Promise<string | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "YourAppName/1.0",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch address");
        }
        const data = await response.json();

        if (data && data.display_name) {
            return data.display_name;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}