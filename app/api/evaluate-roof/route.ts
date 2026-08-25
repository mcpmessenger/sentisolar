import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { address } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // 1. Geocode the address to get Latitude and Longitude
    const geoRes = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address) + "&key=" + apiKey);
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    // 2. Call Google Solar API for building insights
    const solarRes = await fetch("https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=" + lat + "&location.longitude=" + lng + "&requiredQuality=HIGH&key=" + apiKey);
    const solarData = await solarRes.json();

    if (solarData.error) {
       console.error("Solar API Error:", solarData.error);
       return NextResponse.json({ 
         panels: 15, 
         sunshineHours: 1200, 
         note: "Simulated fallback data due to Solar API not being enabled yet." 
       });
    }

    const panels = solarData.solarPotential?.maxArrayPanelsCount || 0;
    const sunshineHours = Math.round(solarData.solarPotential?.maxSunshineHoursPerYear || 0);

    return NextResponse.json({ panels, sunshineHours });

  } catch (error) {
    console.error("Evaluate Roof Error:", error);
    return NextResponse.json({ error: "Failed to evaluate roof" }, { status: 500 });
  }
}
