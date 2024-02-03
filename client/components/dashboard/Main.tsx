import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, SafeAreaView } from 'react-native';
import GeoLocation from './GeoLocation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import MultiSelect from 'react-native-multiple-select';

import { SmallEntry } from '../../client-types/SmallEntry';
import EntriesView from './EntriesView';
import { cityFetcher, getActiveMissions, getCities } from './DashboardsServices';
import { Place } from '../../client-types/Place';
import MissionView from './MissionView';
import Logout from '../logout/Logout';
import { useAppDispatch } from '../../hooks';
import { setLocation } from '../../slices/locationSlice';

const Main: React.FC = ({ navigation }: any) => {
  const fetchLocation = GeoLocation();
  const location = useSelector((state: RootState) => state.location);
  const userId = useSelector((state: RootState) => state.user.id);
  const [cityEntries, setCityEntries] = useState<(SmallEntry & { avg: number })[]>([])
  const [activeMissions, setActiveMissions] = useState<Place[]>([])
  const [cityNames, setCityNames] = useState<string[]>([])

  const dispatch = useAppDispatch();

  const asyncFetchLocation = async () => {
    await fetchLocation()
  }

  useEffect(() => {
    // asyncFetchLocation();
    getCities(setCityNames)
  }, [])

  useEffect(() => {
    location.value?.cityName != undefined && cityFetcher(location.value?.cityName, setCityEntries)
  }, [location.value?.cityName]);

  useEffect(() => {
    userId && getActiveMissions(userId, setActiveMissions)
  }, [userId])


  return (
    <View style={styles.container}>
      <View>
        <Logout></Logout>
        <Button title='Go to mission' onPress={() => navigation.navigate('Mission')} />
        <View style={styles.textWrapper}>
          <Text style={styles.locationText}>CITY: {location.value?.cityName}</Text>
          <MultiSelect
            items={
              cityNames.map(city => {
                return { name: city, id: city }
              })
            }
            uniqueKey="id"
            onSelectedItemsChange={(selectedItems) => {
              location.value?.lat && location.value.lng && dispatch(setLocation({
                cityName: selectedItems[0],
                lng: location.value.lng,
                lat: location.value.lat
              }
              ))
            }
            }
            selectedItems={[location.value?.cityName]}
            single={true}
          />
          {activeMissions.length == 0 ?
            <Text style={styles.locationText}>No active missions available</Text> :
            <MissionView places={activeMissions}></MissionView>
          }
        </View>
      </View>
      {location.value?.cityName ? (
        <View style={{
          flex: 7,
          borderWidth: 2,
        }}>
          <EntriesView entries={cityEntries}></EntriesView>
        </View>
      ) : (
        <Text style={styles.fetchingText}>Sending position to the Mothership...</Text>
      )}
    </View>
  );
};

export default Main;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    fontFamily: 'Gruppe_A'
  },
  textWrapper: {
    justifyContent: 'center',
    fontFamily: 'Gruppe_A'
  },
  locationText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Gruppe_A',
  },
  fetchingText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Gruppe_A'
  },
  bottom: {
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Gruppe_A'
  }
});
