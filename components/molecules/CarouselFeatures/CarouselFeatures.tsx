import React, { useState, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CarouselFeatureItem from "./CarouselFeatureItem";

const { width: windowWidth } = Dimensions.get("window");

const CarouselFeatures = ({ features }) => {
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
    if (selectedIndex < features.length - 1) {
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
    <CarouselFeatureItem
      selectedIndex={selectedIndex}
      index={index}
      item={item}
    />
  );

  return (
    <>
      <View
        style={{
          flex: 1,
          alignSelf: "center",
          alignItems: "center",
          width: "90%",
          marginBottom: 20,

          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          allowFontScaling={false}
          style={{ color: "white", fontSize: 18, fontWeight: "400" }}
        >
          Caracteristicas
        </Text>

        <View style={styles.arrowContainer}>
          <TouchableOpacity
            onPress={handlePrev}
            style={styles.arrowButton}
            disabled={selectedIndex === 0}
          >
            <Icon
              name="chevron-back"
              size={25}
              color={selectedIndex === 0 ? "gray" : "#FFFFFF"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={styles.arrowButton}
            disabled={selectedIndex === features.length - 1}
          >
            <Icon
              name="chevron-forward"
              size={25}
              color={selectedIndex === features.length - 1 ? "gray" : "#FFFFFF"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={features}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef.current}
        />
      </View>
    </>
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

  arrowContainer: {
    flexDirection: "row",
  },
  arrowButton: {
    marginHorizontal: 10,
  },
});

export default CarouselFeatures;
