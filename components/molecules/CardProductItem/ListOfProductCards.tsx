import React from "react";
import { View, StyleSheet } from "react-native";
import CardProductItem, { TypeOfProduct } from "./CardProductItem";

export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  category: string;
  widthImage: string;
  heightImage: string;
}

interface ListOfProductCardsProps {
  list: Product[];
  type: TypeOfProduct;
  widthImage: number;
  heightImage: number;
}

const ListOfProductCards: React.FC<ListOfProductCardsProps> = ({
  list,
  type,
  widthImage,
  heightImage,
}) => {
  const isOdd = list.length % 2 !== 0;

  const updatedList = isOdd
    ? [list[list.length - 1], ...list.slice(0, -1)]
    : list;

  return (
    <View style={[styles.gridContainer, type === "phone" && styles.phoneGrid]}>
      {updatedList.map((product, index) => (
        <CardProductItem
          widthImage={widthImage}
          heightImage={heightImage}
          type={type}
          key={product.id}
          product={product}
          isFirstItem={isOdd && index === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  phoneGrid: {
    flexDirection: "column",
  },
});

export default ListOfProductCards;
