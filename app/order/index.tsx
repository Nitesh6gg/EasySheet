
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { convertSheetDataToObjects, SheetResponse } from '@/src/util/sheetDataConverter';

export default function Index () {
  const [data, setData] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    // Replace this with your actual fetch call to Google Sheets API
    const fetchSheetData = async () => {
      try {
        const response = await fetch(
          'https://sheets.googleapis.com/v4/spreadsheets/17gHXssleqo6LPp4XP8xzU0Vpt1NBjbIdgtEJlC8RaJk/values/sheet1?valueRenderOption=FORMATTED_VALUE&key=AIzaSyBN5c4SopZBhx18csw4bta4gjftH_sDDK8'
        );
        const json: SheetResponse = await response.json();
        const objects = convertSheetDataToObjects(json);

        console.log(objects);
        setData(objects);
      } catch (error) {
        console.error('Error fetching sheet data:', error);
      }
    };

    fetchSheetData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sheet Data</Text>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{JSON.stringify(item)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 10 },
  item: { padding: 10, marginVertical: 5, backgroundColor: '#f0f0f0', borderRadius: 5 },
});
