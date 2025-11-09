export async function geocodePlace(placeName, apiKey) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    placeName
  )}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status === "OK") {
    return data.results[0].geometry.location; // { lat, lng }
  }

  return null;
}
