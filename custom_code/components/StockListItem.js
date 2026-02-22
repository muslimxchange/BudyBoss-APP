import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const formatPrice = (price) => {
  if (price == null) return "—";
  return `$${Number(price).toFixed(2)}`;
};

const formatChange = (change) => {
  if (change == null) return "";
  const num = Number(change);
  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}`;
};

const formatPercent = (pct) => {
  if (pct == null) return "";
  const num = Number(pct);
  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
};

const StockListItem = ({ item, onPress, shariahStatus }) => {
  const change = item.changesPercentage || item.change_percent;
  const isPositive = Number(change) >= 0;
  const changeColor = isPositive ? "#34C759" : "#FF3B30";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={styles.symbolRow}>
          <Text style={styles.symbol}>
            {item.symbol || item.ticker || ""}
          </Text>
          {shariahStatus && (
            <View
              style={[
                styles.complianceDot,
                {
                  backgroundColor:
                    shariahStatus === "compliant"
                      ? "#34C759"
                      : shariahStatus === "non-compliant"
                      ? "#FF3B30"
                      : "#FF9500",
                },
              ]}
            />
          )}
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {item.name || item.companyName || ""}
        </Text>
        {item.exchangeShortName && (
          <Text style={styles.exchange}>{item.exchangeShortName}</Text>
        )}
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <View style={[styles.changeBadge, { backgroundColor: changeColor }]}>
          <Text style={styles.changeText}>{formatPercent(change)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  symbolRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  symbol: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  complianceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  name: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  exchange: {
    fontSize: 12,
    color: "#AEAEB2",
    marginTop: 1,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  changeBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 70,
    alignItems: "center",
  },
  changeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});

export default StockListItem;
