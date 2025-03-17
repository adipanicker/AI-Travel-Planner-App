// in your services/GooglePlaceApi.js file

export const GetPhotoRef = async (placeName) => {
  try {
    // First, search for the place to get its ID
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
          "X-Goog-FieldMask": "places.id,places.displayName",
        },
        body: JSON.stringify({
          textQuery: placeName,
          languageCode: "en",
        }),
      }
    );

    const data = await response.json();

    if (!data.places || data.places.length === 0) {
      console.log("No places found for:", placeName);
      return null;
    }

    // Get the place ID from the search results
    const placeId = data.places[0].id;

    // Now get the place details with photos
    const detailsResponse = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: "GET",
        headers: {
          "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
          "X-Goog-FieldMask": "photos",
        },
      }
    );

    const details = await detailsResponse.json();

    // Check if we got photos and return the first photo's resource name
    if (details.photos && details.photos.length > 0) {
      return details.photos[0].name;
    } else {
      console.log("No photos found for place:", placeName);
      return null;
    }
  } catch (error) {
    console.error("Error in GetPhotoRef:", error);
    return null;
  }
};
