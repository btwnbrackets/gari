import { StyleSheet } from "react-native";
import { BOX_ALPHA, colors, fonts, fontSize, radius, spacing } from "./theme";

export const commonStyles = StyleSheet.create({
  // padding
  padLV: {
    paddingVertical: spacing.large,
  },
  padMV: {
    paddingVertical: spacing.medium,
  },
  padSV: {
    paddingVertical: spacing.small,
  },

  padLH: {
    paddingHorizontal: spacing.large,
  },
  padMH: {
    paddingHorizontal: spacing.medium,
  },
  padSH: {
    paddingHorizontal: spacing.small,
  },

  padL: {
    padding: spacing.large,
  },
  padM: {
    padding: spacing.medium,
  },
  padS: {
    padding: spacing.small,
  },

  // gap
  gapM: {
    gap: spacing.medium,
  },
  gapL: {
    gap: spacing.large,
  },

  // margin
  marginLV: {
    marginVertical: spacing.large,
  },
  marginMV: {
    marginVertical: spacing.medium,
  },
  marginSV: {
    marginVertical: spacing.small,
  },

  // containers
  scrollContainer: {
    flex: 1,
    // padding: spacing.medium,
  },
  flatList: {
    flexGrow: 1,
    padding: spacing.medium,
  },
  centeredFullWidth: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.medium,
  },
  inputText: {
    borderRadius: radius.small,
    padding: spacing.small,
    borderWidth: 1,
    alignSelf: "stretch",
  },

  // text
  borderRadiusCard: {
    borderRadius: radius.small,
    padding: spacing.small,
  },
  messageText: {
    textAlign: "center",
    fontSize: fontSize.medium,
  },
  normalText: {
    fontSize: fontSize.small,
  },
  textMedium: {
    fontSize: fontSize.medium,
  },
  textSmall: {
    fontSize: fontSize.small,
  },
  textLarge: {
    fontSize: fontSize.large,
  },
  textBM: {
    fontSize: fontSize.medium,
    fontWeight: "bold",
  },
  textBL: {
    fontSize: fontSize.large,
    fontWeight: "bold",
  },
  textBXL: {
    fontSize: fontSize.xlarge,
    fontWeight: "bold",
  },
  centeredText: {
    textAlign: "center",
  },
  
  // repeated
  furigana: {
    fontFamily: fonts.japanese,
    fontSize: fontSize.small,
    lineHeight: 15,
  },
  base: {
    fontFamily: fonts.japanese,
    fontSize: fontSize.large,
    lineHeight: 25,
  },
  tags: {
    borderRadius: radius.large,
    alignSelf: "center",
    margin: spacing.xsmall,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xsmall,
    fontSize: fontSize.small,
  },
  note: {
    backgroundColor: colors["grey-dk-000"] + BOX_ALPHA,
    padding: 4,
    marginVertical: 4,
    borderLeftColor: colors["grey-dk-000"],
    borderLeftWidth: 5,
    borderRadius: 4,
  },
});
