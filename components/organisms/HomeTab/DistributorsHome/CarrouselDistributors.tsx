import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const BannerWelcome = require("@/assets/images/hand-cellphone.png");

const images = [
  { id: "1", uri: BannerWelcome },
  { id: "2", uri: BannerWelcome },
  { id: "3", uri: BannerWelcome },
];

const CarrouselDistributors = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image resizeMode="contain" source={item.uri} style={styles.image} />
    </View>
  );

  const { colors } = useTheme<ThemeCustom>();

  return (
    <View style={{ marginTop: 40 }}>
      <TouchableOpacity onPress={handlePrev} style={styles.arrowLeft}>
        <Icon name="chevron-back" size={30} color={colors.neutro} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNext} style={styles.arrowRight}>
        <Icon name="chevron-forward" size={30} color={colors.neutro} />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.carousel}>
          <FlatList
            ref={flatListRef}
            data={images}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  carousel: {
    width: width * 1,
  },
  flatListContent: {
    alignItems: "center",
  },
  imageContainer: {
    width: width * 1,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    top: 0,
    zIndex: 1,
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    top: 0,
    zIndex: 1,
  },
});

export default CarrouselDistributors;
