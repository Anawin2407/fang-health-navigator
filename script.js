
const SUPABASE_URL = "https://zneoezrcbqkoemiuybyv.supabase.co";
const SUPABASE_KEY = "sb_publishable_C63bJSeaOv7Fn-bGDht6Jw_m_-FsHgK";


let hospitals = [];

async function loadHospitals() {
    const status = document.getElementById("status");
    const hospitalList = document.getElementById("hospitalList");

    try {
        status.textContent = "กำลังโหลดข้อมูลโรงพยาบาล...";

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/hospitals?select=*`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        hospitals = await response.json();

        document.getElementById("hospitalCount").textContent =
            `${hospitals.length} แห่ง`;

        displayHospitals(hospitals);

        status.textContent = `พบโรงพยาบาล ${hospitals.length} แห่ง`;
    } catch (error) {
        status.textContent = "โหลดข้อมูลไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อ";
        console.error("เกิดข้อผิดพลาด:", error);
    }
}

function displayHospitals(data) {
    const hospitalList = document.getElementById("hospitalList");

    if (data.length === 0) {
        hospitalList.textContent = "ไม่พบข้อมูลโรงพยาบาล";
        return;
    }

    hospitalList.replaceChildren();

    const startSelect = document.getElementById("startHospital");
    const endSelect = document.getElementById("endHospital");

    [startSelect, endSelect].forEach(select => {
        if (!select) return;

        select.replaceChildren();

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent =
            select.id === "startHospital"
                ? "เลือกโรงพยาบาลต้นทาง"
                : "เลือกโรงพยาบาลปลายทาง";

        select.appendChild(placeholder);

        data.forEach(hospital => {
            const option = document.createElement("option");
            option.value = hospital.id;
            option.textContent = hospital.name;
            select.appendChild(option);
        });
    });

    hospitalMarkers.clearLayers();

    data.forEach(hospital => {
        const lat = Number(hospital.latitude);
        const lng = Number(hospital.longitude);

        if (
            hospital.latitude != null &&
            hospital.longitude != null &&
            Number.isFinite(lat) &&
            Number.isFinite(lng)
        ) {
            L.marker([lat, lng])
                .bindPopup(`<b>${hospital.name || "โรงพยาบาล"}</b>`)
                .addTo(hospitalMarkers);
        }
    });

    if (hospitalMarkers.getLayers().length > 0) {
        map.fitBounds(hospitalMarkers.getBounds(), {
            padding: [30, 30],
            maxZoom: 13
        });
    }

    data.forEach(hospital => {
        const card = document.createElement("article");
        card.className = "hospital-card";

        const name = document.createElement("h3");
        name.textContent = hospital.name || "ไม่ระบุชื่อโรงพยาบาล";
        card.appendChild(name);

        const address = document.createElement("p");
        address.textContent = `ที่อยู่: ${hospital.address || "ไม่มีข้อมูล"}`;
        card.appendChild(address);


        const phone = document.createElement("p");
        phone.textContent = `เบอร์โทร: ${hospital.phone || "ไม่มีข้อมูล"}`;
        card.appendChild(phone);

        const openingTime = document.createElement("p");
        openingTime.textContent = `เวลาเปิด: ${hospital.opening_time || "ไม่มีข้อมูล"}`;
        card.appendChild(openingTime);

        const closingTime = document.createElement("p");
        closingTime.textContent = `เวลาปิด: ${hospital.closing_time || "ไม่มีข้อมูล"}`;
        card.appendChild(closingTime);


        if (hospital.latitude != null && hospital.longitude != null) {
            const location = document.createElement("p");
            location.textContent =
                `พิกัด: ${hospital.latitude}, ${hospital.longitude}`;
            card.appendChild(location);

            const mapLink = document.createElement("a");
            mapLink.textContent = "ดูตำแหน่งบน Google Maps";
            mapLink.href =
                `https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`;
            mapLink.target = "_blank";
            mapLink.rel = "noopener noreferrer";
            card.appendChild(mapLink);
        }

        hospitalList.appendChild(card);
    });
}


document.getElementById("searchInput").addEventListener("input", event => {
    const keyword = event.target.value.trim().toLowerCase();

    const filtered = hospitals.filter(hospital =>
        (hospital.name || "").toLowerCase().includes(keyword)
    );

    displayHospitalCards(filtered);

    document.getElementById("status").textContent =
        `พบโรงพยาบาล ${filtered.length} แห่ง`;
});

function displayHospitalCards(data) {
    const hospitalList = document.getElementById("hospitalList");
    hospitalList.replaceChildren();

    if (data.length === 0) {
        hospitalList.textContent = "ไม่พบข้อมูลโรงพยาบาล";
        return;
    }

    data.forEach(hospital => {
        const card = document.createElement("article");
        card.className = "hospital-card";

        const name = document.createElement("h3");
        name.textContent = hospital.name || "ไม่ระบุชื่อโรงพยาบาล";
        card.appendChild(name);

        const address = document.createElement("p");
        address.textContent = `ที่อยู่: ${hospital.address || "ไม่มีข้อมูล"}`;
        card.appendChild(address);


        const phone = document.createElement("p");
        phone.textContent = `เบอร์โทร: ${hospital.phone || "ไม่มีข้อมูล"}`;
        card.appendChild(phone);

        const openingTime = document.createElement("p");
        openingTime.textContent = `เวลาเปิด: ${hospital.opening_time || "ไม่มีข้อมูล"}`;
        card.appendChild(openingTime);

        const closingTime = document.createElement("p");
        closingTime.textContent = `เวลาปิด: ${hospital.closing_time || "ไม่มีข้อมูล"}`;
        card.appendChild(closingTime);


        if (hospital.latitude != null && hospital.longitude != null) {
            const location = document.createElement("p");
            location.textContent =
                `พิกัด: ${hospital.latitude}, ${hospital.longitude}`;
            card.appendChild(location);

            const mapLink = document.createElement("a");
            mapLink.textContent = "ดูตำแหน่งบน Google Maps";
            mapLink.href =
                `https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`;
            mapLink.target = "_blank";
            mapLink.rel = "noopener noreferrer";
            card.appendChild(mapLink);
        }


        card.style.cursor = "pointer";

        card.addEventListener("click", event => {
            console.log("คลิกการ์ดโรงพยาบาล:", hospital.name);
            // ไม่เปลี่ยนแผนที่เมื่อกดลิงก์ Google Maps
            if (event.target.closest("a")) return;

            const lat = Number(hospital.latitude);
            const lng = Number(hospital.longitude);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                alert("โรงพยาบาลนี้ไม่มีพิกัดที่ถูกต้อง");
                return;
            }

            map.setView([lat, lng], 15);

            L.popup()
                .setLatLng([lat, lng])
                .setContent(`<b>${hospital.name || "โรงพยาบาล"}</b>`)
                .openOn(map);
        });


        hospitalList.appendChild(card);



    });
}
let selectedHospitalMarker = null;

document.getElementById("hospitalList").addEventListener("click", event => {
    const card = event.target.closest(".hospital-card");

    if (!card || event.target.closest("a")) return;

    const name = card.querySelector("h3")?.textContent;
    const hospital = hospitals.find(h => h.name === name);

    if (!hospital) return;

    const lat = Number(hospital.latitude);
    const lng = Number(hospital.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        alert("พิกัดโรงพยาบาลไม่ถูกต้อง");
        return;
    }

    map.setView([lat, lng], 15);

    if (selectedHospitalMarker) {
        map.removeLayer(selectedHospitalMarker);
    }

    selectedHospitalMarker = L.circleMarker([lat, lng], {
        radius: 12,
        color: "#ffffff",
        weight: 3,
        fillColor: "#f59e0b",
        fillOpacity: 1
    }).addTo(map);

    selectedHospitalMarker
        .bindPopup(`<b>${hospital.name || "โรงพยาบาล"}</b>`)
        .openPopup();
});

const map = L.map("map").setView([19.91, 99.20], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const hospitalMarkers = L.featureGroup().addTo(map);

loadHospitals();


let originMarker = null;
let originPoint = null;


// คลิกแผนที่เพื่อเลือกตำแหน่งต้นทาง
map.on("click", function (event) {
    originPoint = event.latlng;

    if (originMarker) {
        map.removeLayer(originMarker);
    }

    originMarker = L.marker(originPoint)
        .addTo(map)
        .bindPopup("ตำแหน่งต้นทาง")
        .openPopup();

    document.getElementById("originStatus").textContent =
        `พิกัด ${originPoint.lat.toFixed(6)}, ${originPoint.lng.toFixed(6)}`;

    document.getElementById("routeStatus").textContent =
        "เลือกต้นทางแล้ว กรุณาเลือกโรงพยาบาลปลายทาง";
});

// ล้างตำแหน่งต้นทางเพื่อเลือกใหม่
document.getElementById("clearOrigin").addEventListener("click", function () {
    if (originMarker) {
        map.removeLayer(originMarker);
        originMarker = null;
    }

    originPoint = null;

    document.getElementById("originStatus").textContent =
        "กรุณาคลิกเลือกตำแหน่งบนแผนที่";

    document.getElementById("routeStatus").textContent = "";

    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
});


let routeLine = null;


document.getElementById("findRoute").addEventListener("click", async () => {
    const endId = document.getElementById("endHospital").value;
    const status = document.getElementById("routeStatus");

    if (!originPoint) {
        status.textContent = "กรุณาคลิกเลือกตำแหน่งต้นทางบนแผนที่";
        return;
    }

    if (!endId) {
        status.textContent = "กรุณาเลือกโรงพยาบาลปลายทาง";
        return;
    }

    const end = hospitals.find(
        h => String(h.id) === String(endId)
    );

    console.log("โรงพยาบาลปลายทาง ID:", endId);
    console.log("ข้อมูลโรงพยาบาล:", end);

    if (!end) {
        status.textContent = "ไม่พบข้อมูลโรงพยาบาลปลายทาง";
        return;
    }

    const startLat = originPoint.lat;
    const startLng = originPoint.lng;
    const endLat = Number(end.latitude);
    const endLng = Number(end.longitude);

    if (![startLat, startLng, endLat, endLng].every(Number.isFinite)) {
        status.textContent = "พิกัดไม่ถูกต้อง";
        return;
    }

    status.textContent = "กำลังคำนวณเส้นทาง...";

    try {
        const url =
            `https://router.project-osrm.org/route/v1/driving/` +
            `${startLng},${startLat};${endLng},${endLat}` +
            `?overview=full&geometries=geojson`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("ไม่สามารถเชื่อมต่อ OSRM ได้");
        }

        const result = await response.json();

        if (result.code !== "Ok" || !result.routes.length) {
            throw new Error("ไม่พบเส้นทาง");
        }

        const route = result.routes[0];
        const coordinates = route.geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
        );

        if (routeLine) {
            map.removeLayer(routeLine);
        }

        routeLine = L.polyline(coordinates, {
            color: "#e74c3c",
            weight: 5
        }).addTo(map);

        map.fitBounds(routeLine.getBounds(), {
            padding: [30, 30]
        });


        const distance = (route.distance / 1000).toFixed(2);
        const minutes = Math.round(route.duration / 60);

        status.textContent =
            `ต้นทาง: ${originPoint.lat.toFixed(6)}, ${originPoint.lng.toFixed(6)}
ปลายทาง: ${end.name}
ระยะทางประมาณ ${distance} กิโลเมตร
ใช้เวลาขับรถประมาณ ${minutes} นาที`;

    } catch (error) {
        console.error("Route error:", error);
        status.textContent =
            "คำนวณเส้นทางไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
    }
});




document.getElementById("clearRoute").addEventListener("click", function () {

    // ลบเส้นทางสีแดง
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }

    // ลบหมุดต้นทาง
    if (originMarker) {
        map.removeLayer(originMarker);
        originMarker = null;
    }

    // รีเซ็ตพิกัดต้นทาง
    originPoint = null;

    // รีเซ็ตข้อความสถานะ
    document.getElementById("originStatus").textContent =
        "กรุณาคลิกเลือกตำแหน่งต้นทางบนแผนที่";

    document.getElementById("routeStatus").textContent =
        "ล้างเส้นทางแล้ว กรุณาเลือกต้นทางใหม่";

});




document.getElementById("findNearest").addEventListener("click", async () => {
    const resultsBox = document.getElementById("nearestResults");

    if (!originPoint) {
        resultsBox.textContent = "กรุณาคลิกเลือกตำแหน่งต้นทางบนแผนที่ก่อน";
        return;
    }

    const candidates = hospitals.filter(hospital => {
        const lat = Number(hospital.latitude);
        const lng = Number(hospital.longitude);

        return (
            hospital.latitude != null &&
            hospital.longitude != null &&
            Number.isFinite(lat) &&
            Number.isFinite(lng)
        );
    });

    if (candidates.length === 0) {
        resultsBox.textContent = "ไม่พบโรงพยาบาลที่มีพิกัดถูกต้อง";
        return;
    }

    resultsBox.textContent = "กำลังคำนวณระยะทางไปยังโรงพยาบาล...";

    try {
        const results = await Promise.all(
            candidates.map(async hospital => {
                const endLat = Number(hospital.latitude);
                const endLng = Number(hospital.longitude);

                const url =
                    "https://router.project-osrm.org/route/v1/driving/" +
                    `${originPoint.lng},${originPoint.lat};${endLng},${endLat}` +
                    "?overview=false";

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("เชื่อมต่อระบบคำนวณเส้นทางไม่สำเร็จ");
                }

                const data = await response.json();

                if (data.code !== "Ok" || !data.routes?.length) {
                    return null;
                }

                return {
                    hospital,
                    distance: data.routes[0].distance / 1000,
                    minutes: Math.round(data.routes[0].duration / 60)
                };
            })
        );

        const sorted = results
            .filter(Boolean)
            .sort((a, b) => a.distance - b.distance);

        resultsBox.replaceChildren();

        if (sorted.length === 0) {
            resultsBox.textContent = "ไม่พบเส้นทางขับรถไปยังโรงพยาบาล";
            return;
        }

        const heading = document.createElement("h3");
        heading.textContent = "โรงพยาบาลเรียงตามระยะทาง";
        resultsBox.appendChild(heading);

        sorted.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "nearest-hospital-item";

            const name = document.createElement("strong");
            name.textContent =
                `${index + 1}. ${item.hospital.name || "โรงพยาบาล"}`;

            const detail = document.createElement("p");
            detail.textContent =
                `ระยะทาง ${item.distance.toFixed(2)} กม. · ` +
                `ใช้เวลาขับรถประมาณ ${item.minutes} นาที`;

            card.append(name, detail);
            resultsBox.appendChild(card);
        });

    } catch (error) {
        console.error("Nearest hospital error:", error);
        resultsBox.textContent =
            "คำนวณไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
    }
});