import React from "react";
import { View, StyleSheet } from "react-native";
import HTML from "react-native-render-html";

interface HTMLRenderProps {
  htmlContent: string;
  pColor?: string;
  h2Color?: string;
  figureWidth?: number;
  figureHeight?: number;
  showFigures?: boolean;
  aColor?: string;
  aTextDecorationColor?: string;
}

const RenderHTML: React.FC<HTMLRenderProps> = ({
  htmlContent,
  pColor = "white",
  h2Color = "red",
  showFigures = false,
  aColor = "red",
  aTextDecorationColor = "red",
}) => {
  const figureDisplay = showFigures ? "flex" : "none";

  return (
    <View style={styles.container}>
      <HTML
        tagsStyles={{
          p: { color: pColor },
          h2: { color: h2Color },
          figure: {
            display: figureDisplay,
            paddingHorizontal: 40,
          },
          a: {
            color: aColor,
            textDecorationColor: aTextDecorationColor,
          },
          // Añade estilos adicionales para otros tags si es necesario
        }}
        source={{ html: htmlContent }}
        contentWidth={800}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RenderHTML;
