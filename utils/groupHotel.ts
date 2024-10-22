type Hotel = {
  id: number;
  name: string;
  address: string;
  city: string;
  mainimage: string;
  latitude: number;
  longitude: number;
};

type CityWithHotels = {
  city: string;
  hotels: Hotel[];
};

// Function to group hotels by city
export function groupHotelsByCity(hotels: Hotel[]): CityWithHotels[] {
  const cityMap: Record<string, CityWithHotels> = {};

  hotels.forEach((hotel) => {
    if (!cityMap[hotel.city]) {
      // Initialize the city with an empty hotels array if not already present
      cityMap[hotel.city] = { city: hotel.city, hotels: [] };
    }
    // Add the hotel to the corresponding city's hotels array
    cityMap[hotel.city].hotels.push(hotel);
  });

  // Convert the city map to an array of CityWithHotels
  return Object.values(cityMap);
}