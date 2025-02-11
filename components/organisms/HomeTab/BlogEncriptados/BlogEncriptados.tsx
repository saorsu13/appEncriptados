import React from "react";
import CardAccordionBlog from "./CardAccordionBlog";
import { Text, View } from "react-native";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/posts";
import { t } from "i18next";
export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    _acf_changed: boolean;
    inline_featured_image: boolean;
    footnotes: string;
  };
  categories: number[];
  tags: any[];
  acf: any[];
  _links: {
    self: {
      href: string;
    }[];
    collection: {
      href: string;
    }[];
    about: {
      href: string;
    }[];
    author: {
      embeddable: boolean;
      href: string;
    }[];
    replies: {
      embeddable: boolean;
      href: string;
    }[];
    "version-history": {
      count: number;
      href: string;
    }[];
    "predecessor-version": {
      id: number;
      href: string;
    }[];
    "wp:featuredmedia": {
      embeddable: boolean;
      href: string;
    }[];
    "wp:attachment": {
      href: string;
    }[];
    "wp:term": {
      taxonomy: string;
      embeddable: boolean;
      href: string;
    }[];
    curies: {
      name: string;
      href: string;
      templated: boolean;
    }[];
  };
}
const BlogEncriptados = () => {
  const { colors } = useTheme<ThemeCustom>();

  const { data, isFetching } = useQuery({
    queryKey: ["blogs"],
    gcTime: 0,
    queryFn: () => getPosts(),
  });

  const posts = data as unknown as Post[];

  return (
    <>
      <View
        style={{
          marginBottom: 25,
          marginTop: 25,
          alignSelf: "center",
          justifyContent: "center",
          borderRadius: 25,
          width: 150,
        }}
      >
        <Text
          allowFontScaling={false}
          style={{
            color: colors.primaryColor,
            textAlign: "center",
            fontWeight: 700,

            fontSize: 18,
          }}
        >
          {t("pages.home-tab.blog")}
        </Text>
      </View>

      {posts && posts.length > 0 ? <CardAccordionBlog posts={posts} /> : null}
    </>
  );
};

export default BlogEncriptados;
