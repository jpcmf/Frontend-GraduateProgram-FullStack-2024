const getMapBoxConfig = () => {
  const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN_MAP_BOX;
  const baseUrl = process.env.NEXT_PUBLIC_URL_MAP_BOX;

  if (!token || !baseUrl) throw new Error("Missing MapBox environment variables");

  return { token, baseUrl };
};

export interface MapBoxFeature {
  id: string;
  place_name: string;
  center: [number, number];
}

export interface MapBoxResponse {
  features: MapBoxFeature[];
}

export const fetchLocationSuggestions = async (query: string): Promise<MapBoxResponse> => {
  const { token, baseUrl } = getMapBoxConfig();
  const url = `${baseUrl}/${encodeURIComponent(query)}.json?country=BR&access_token=${token}`;
  const response = await fetch(url);

  if (!response.ok) throw new Error(`MapBox request failed: ${response.status} ${response.statusText}`);

  return response.json();
};

export const fetchCoordinates = async (query: string): Promise<[number, number]> => {
  const { token, baseUrl } = getMapBoxConfig();
  const url = `${baseUrl}/${encodeURIComponent(query)}.json?country=BR&limit=1&access_token=${token}`;
  const response = await fetch(url);

  if (!response.ok) throw new Error(`MapBox request failed: ${response.status} ${response.statusText}`);

  const data: MapBoxResponse = await response.json();
  const feature = data.features[0];

  if (!feature) throw new Error(`No results found for: "${query}"`);

  return feature.center; // [lng, lat]
};
