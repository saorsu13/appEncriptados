import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Post } from "./BlogEncriptados";
import RenderHTML from "@/components/molecules/RenderHTML/RenderHTML";
import { useQuery } from "@tanstack/react-query";
import { getPostImage } from "@/api/posts";
import SkeletonGrid from "@/components/molecules/SkeletonContent/SkeletonGrid";
import { router } from "expo-router";
import { HOME_TAB_ROUTES } from "@/routes/HomeTabRoutes";

const CardBlog = require("@/assets/images/card-blog.png");

interface CarouselBlogItemProps {
  post: Post;
}

export const CarouselBlogItem: React.FC<CarouselBlogItemProps> = ({ post }) => {
  const { colors } = useTheme<ThemeCustom>();

  const { data, isFetching } = useQuery({
    queryKey: ["getPostImage", post.featured_media],
    gcTime: 0,
    queryFn: () => getPostImage(post.featured_media),
  });

  const imageSource = data?.guid?.rendered ? { uri: data.guid.rendered } : null;

  if (isFetching) {
    null;
  }
  return (
    <View
      style={{ ...styles.card, backgroundColor: colors.backgroundSecondary }}
    >
      <View style={styles.imageContainer}>
        <ImageBackground
          style={styles.image}
          resizeMode="contain"
          source={imageSource}
        />
      </View>
      <Text
        allowFontScaling={false}
        style={{ ...styles.title, color: colors.primaryText }}
      >
        {post.title.rendered}
      </Text>

      <RenderHTML
        aColor="blue"
        pColor={colors.secondaryText}
        aTextDecorationColor="blue"
        htmlContent={post.content.rendered.substring(0, 200) + "..."}
      />

      <TouchableOpacity
        onPress={() =>
          router.push(`${HOME_TAB_ROUTES.HOME_TAB_INDEX}/blog/${post.id}`)
        }
      >
        <Text
          allowFontScaling={false}
          style={{ ...styles.readMore, color: colors.primaryText }}
        >
          Leer más
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    borderRadius: 10,
    marginHorizontal: 6,
    elevation: 100,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageContainer: {
    width: "100%",
    height: 170,
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  description: {
    fontWeight: "300",
    fontSize: 14,
  },
  readMore: {
    fontWeight: "300",
    fontSize: 14,

    textDecorationLine: "underline",
  },
});

export default CarouselBlogItem;
