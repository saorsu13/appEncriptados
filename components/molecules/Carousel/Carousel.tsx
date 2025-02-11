import React, { useState, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { CarouselItem } from "./CarouselItem";

const { width: windowWidth } = Dimensions.get("window");

const Carousel = ({ data }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setSelectedIndex(index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handlePrev = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      flatListRef.current.scrollToIndex({
        index: newIndex,
        animated: true,
        viewPosition: 0.5,
      });
      setSelectedIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (selectedIndex < data.length - 1) {
      const newIndex = selectedIndex + 1;
      flatListRef.current.scrollToIndex({
        index: newIndex,
        animated: true,
        viewPosition: 0.5,
      });
      setSelectedIndex(newIndex);
    }
  };

  const renderItem = ({ item, index }) => (
    <CarouselItem selectedIndex={selectedIndex} index={index} item={item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
      />

      <View style={styles.buttonContainer}>
        <View style={styles.arrowContainer}>
          <TouchableOpacity
            onPress={handlePrev}
            style={styles.arrowButton}
            disabled={selectedIndex === 0}
          >
            <Icon
              name="chevron-back"
              size={30}
              color={selectedIndex === 0 ? "#22677D" : "#10B4E7"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={styles.arrowButton}
            disabled={selectedIndex === data.length - 1}
          >
            <Icon
              name="chevron-forward"
              size={30}
              color={selectedIndex === data.length - 1 ? "#22677D" : "#10B4E7"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    paddingHorizontal: (windowWidth - 220) / 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#03161C",
    paddingVertical: 12,
    width: "34%",
    borderRadius: 20,
    alignSelf: "center",

    marginTop: 20,
  },
  arrowContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  arrowButton: {
    marginHorizontal: 10,
  },
});

export default Carousel;
