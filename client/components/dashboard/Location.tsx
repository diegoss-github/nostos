import React from "react";
import { View, Text, StyleSheet, Button, GestureResponderEvent, SafeAreaView } from 'react-native';
import GeoLocation from './GeoLocation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useState, useEffect } from "react";
import { SmallEntry } from '../../client-types/SmallEntry';
import EntriesView from './EntriesView';
import { placeFetcher } from './DashboardsServices';
import { selectEntry } from "../../slices/entriesSlice";

const Location: React.FC = ({ navigation }: any) => {
  const placeId = useSelector((state: RootState) => state.places.selectedPlaceId);
  const entryId = useSelector((state: RootState) => state.entries.selectedEntryID);
  const userId = useSelector((state: RootState) => state.user.id);
  const [placeEntries, setPlaceEntries] = useState<(SmallEntry & { avg: number })[]>([])

  console.log(placeId)

  useEffect(() => {
    placeId != null && placeFetcher(placeId, setPlaceEntries)
  }, [placeId, entryId]);


  return (
    <View style={styles.container}>
      {placeId ? (
        <View style={{
          flex: 8,
          borderWidth: 2,
        }}>
          <EntriesView entries={placeEntries}></EntriesView>
        </View>
      ) : (
        <Text style={styles.fetchingText}>Sending position to the Mothership...</Text>
      )}
      {placeEntries.every((entry) => entry.authorId != userId) &&
        <View style={{ flex: 1 }}>
          <Button title="Write a new entry" onPress={() => navigation.navigate('NewEntryForm')} />
        </View>
      }
    </View>
  )
}

export default Location;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    padding: 10,
    fontFamily: 'Gruppe_A',
  },
  locationText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Gruppe_A',
  },
  fetchingText: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'Gruppe_A',
  },
  bottom: {
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Gruppe_A',
  }
});