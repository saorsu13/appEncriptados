import { getProducts } from "@/api/productsTab";
import ListOfProductCards from "@/components/molecules/CardProductItem/ListOfProductCards";
import GradientBanner from "@/components/molecules/GradientBanner/GradientBanner";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native";

const Offers = () => {
  const { data: productsApp, isFetching } = useQuery({
    queryKey: ["productsSim"],
    gcTime: 0, // Corregido gcTime a cacheTime
    queryFn: () => getProducts("app"),
  });

  const { colors } = useTheme<ThemeCustom>();

  return (
    <>
      <View style={{ marginBottom: 10 }}>
        <GradientBanner
          title={""}
          height={"100%"}
          width={"100%"}
          vertical
          colors={["#0000", "#10B4E7"]}
        >
          <ScrollView nestedScrollEnabled={true}>
            <HeaderEncrypted iconBack="/home-tab" />
            <Text
              allowFontScaling={false}
              style={{
                color: colors.neutro,
                fontSize: 20,
                marginTop: 20,
                marginBottom: 20,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Compra tu SIM Card con hasta y llévate 25% más de saldo
            </Text>
            {Array.isArray(productsApp) && productsApp.length > 0 && (
              <View style={styles.container}>
                <ListOfProductCards
                  heightImage={70}
                  widthImage={70}
                  list={productsApp as []}
                  type={"offers"}
                />
              </View>
            )}
          </ScrollView>
        </GradientBanner>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Offers;
