import React, { useState, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { CarouselBlogItem } from "./CarouselBlogItem";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";

const { width: windowWidth } = Dimensions.get("window");

const CardAccordionBlog = ({ posts }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setSelectedIndex(index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 0 });

  const renderItem = ({ item }) => <CarouselBlogItem post={item} />;

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
    if (selectedIndex < posts?.length - 1) {
      const newIndex = selectedIndex + 1;
      flatListRef.current.scrollToIndex({
        index: newIndex,
        animated: true,
        viewPosition: 0.5,
      });
      setSelectedIndex(newIndex);
    }
  };

  const { colors } = useTheme<ThemeCustom>();

  return (
    <>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef.current}
        />
      </View>

      {/* <View
        style={{
          ...styles.buttonContainer,
          backgroundColor: colors.backgroundAlternate2,
        }}
      >
        <View style={styles.arrowContainer}>
          <TouchableOpacity
            onPress={handlePrev}
            style={styles.arrowButton}
            disabled={selectedIndex === 0}
          >
            <Icon
              name="chevron-back"
              size={30}
              color={selectedIndex === 0 ? colors.strokeBorder : colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={styles.arrowButton}
            disabled={selectedIndex === posts?.length - 1}
          >
            <Icon
              name="chevron-forward"
              size={30}
              color={
                selectedIndex === posts.length - 1
                  ? colors.strokeBorder
                  : colors.white
              }
            />
          </TouchableOpacity>
        </View>
      </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flex: 1,
    flexDirection: "row",
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
    paddingVertical: 12,
    width: "34%",
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
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

export default CardAccordionBlog;
