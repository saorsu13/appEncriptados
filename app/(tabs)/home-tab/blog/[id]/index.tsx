import React, { useEffect } from "react";
import { ImageBackground, ScrollView, View, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@shopify/restyle";

import { getPostById, getPostImage } from "@/api/posts";
import { setLoading } from "@/features/loading/loadingSlice";
import { HOME_TAB_ROUTES } from "@/routes/HomeTabRoutes";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import RenderHTML from "@/components/molecules/RenderHTML/RenderHTML";
import { ThemeCustom } from "@/config/theme2";
import { useAppSelector } from "@/hooks/hooksStoreRedux";

export default function Blogs() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { colors } = useTheme<ThemeCustom>();

  const { data, isFetching } = useQuery({
    queryKey: ["postById", id],
    staleTime: 0,
    queryFn: () => getPostById(id as string),
  });

  const { data: image, isFetching: imageFethching } = useQuery({
    queryKey: ["getPostImage", id],
    staleTime: 0,
    queryFn: () => getPostImage(data.featured_media as string),
  });

  const imageSource = image?.guid?.rendered
    ? { uri: image.guid.rendered }
    : null;

  if (isFetching) {
    null;
  }

  const modalRequiredPassword = useAppSelector((state) => {
    return state.modalPasswordRequired.isModalVisible;
  });

  useEffect(() => {
    if ((isFetching && !modalRequiredPassword) || imageFethching) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [isFetching, dispatch, imageFethching]);

  if (!data || isFetching || imageFethching) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <HeaderEncrypted iconBack={HOME_TAB_ROUTES.HOME_TAB_INDEX} />
      <View style={{ padding: 20 }}>
        <View style={styles.imageContainer}>
          <ImageBackground
            style={styles.image}
            resizeMode="contain"
            source={imageSource}
          />
        </View>
        <RenderHTML
          h2Color={colors.primaryText}
          pColor={colors.secondaryText}
          aTextDecorationColor={colors.primaryText}
          showFigures
          htmlContent={data?.content?.rendered}
          aColor={colors.primaryText}
        />
      </View>
    </ScrollView>
  );
}

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
    marginBottom: 10,
  },
  description: {
    fontWeight: "300",
    fontSize: 14,
    marginBottom: 10,
  },
  readMore: {
    fontWeight: "300",
    fontSize: 14,
    marginBottom: 20,
    textDecorationLine: "underline",
  },
});
