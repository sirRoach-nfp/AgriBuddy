import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'



import SegmentedControlTab from 'react-native-segmented-control-tab';


const crops = () => {

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleIndexChange = (index: number) => {
    setSelectedIndex(index);
  };

  
  return (
    <View>

      <SegmentedControlTab
        values={['Crops', 'Rotation Plan']}
        selectedIndex={selectedIndex}
        onTabPress={handleIndexChange}
        tabsContainerStyle={styles.tabContainer}
        tabStyle={styles.tabStyle}
        activeTabStyle={styles.activeTabStyle}
        tabTextStyle={styles.tabTextStyle}
        activeTabTextStyle={styles.activeTabTextStyle}
      />

    </View>
  )
}

export default crops

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabStyle: {
    borderColor: '#6200ee',
  },
  activeTabStyle: {
    backgroundColor: '#6200ee',
  },
  tabTextStyle: {
    color: '#6200ee',
  },
  activeTabTextStyle: {
    color: '#fff',
  },
  content: {
    paddingTop: 20,
    alignItems: 'center',
  },
  
})