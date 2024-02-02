import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Text, Pressable, StyleSheet, View, TouchableOpacity, Linking } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectPlace, setPlaces } from "../../slices/placesSlice";
import { GooglePlaceResponse, Place } from "../../client-types/Place";
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const Mission: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.location);
  const [placesFromGoogle, setPlacesFromGoogle] = useState<Place[]>([]);
  const [selectedMarker, setSelectedMarker] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<number[]>([]);

  const lat = location.value?.lat;
  const lng = location.value?.lng;

  useEffect(() => {
    axios
      .get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
        params: {
          location: `${lat},${lng}`,
          radius: 1000,
          type: "museum",
          key: GOOGLE_KEY,
        },
      })
      .then((response) => {
        const places: Place[] = response.data.results.map(
          (place: GooglePlaceResponse) => ({
            geometry: place.geometry,
            id: place.place_id,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            name: place.name,
          })
        );
        setPlacesFromGoogle(places);
      })
      .catch((error) => console.log(error));
  }, []);

  function handleMarkerPress(place: Place, latitude: number, longitude: number) {
    axios
      .get(`https://maps.googleapis.com/maps/api/directions/json?destination=${latitude},${longitude}&origin=${lat},${lng}&key=${GOOGLE_KEY}`)
      .then((response) => console.log(response))
      .catch((error) => console.log(error))
    setSelectedCoord([latitude, longitude])  
    setSelectedMarker(true);
  }

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      initialRegion={{
        latitude: location.value?.lat ?? 0,
        longitude: location.value?.lng ?? 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {placesFromGoogle.map((place, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: place.lat, longitude: place.lng }}
          title={place.name}
          onPress={() => handleMarkerPress(place, place.lat, place.lng )}
        />
        ))}
        {selectedMarker && (
            <Pressable style={styles.pressable} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${selectedCoord[0]},${selectedCoord[1]}&travelmode=walking`)}>
              <Text style={styles.text}>Get directions</Text>
            </Pressable>
        )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    fontFamily: 'Gruppe_A', 
  },
  pressable: {
    position: 'absolute',
    top: 20,
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Gruppe_A', 
  },
  text: {
    fontSize: 30,
    color: 'blue',
    backgroundColor: 'green',
    fontFamily: 'Gruppe_A', 
  }
});

export default Mission;
