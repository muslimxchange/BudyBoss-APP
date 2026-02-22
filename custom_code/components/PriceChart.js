import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_HEIGHT = 200;
const CHART_PADDING = 16;

const TIME_RANGES = [
  { label: "1D", key: "1D" },
  { label: "1W", key: "1W" },
  { label: "1M", key: "1M" },
  { label: "3M", key: "3M" },
  { label: "1Y", key: "1Y" },
  { label: "5Y", key: "5Y" },
];

const filterDataByRange = (data, range) => {
  if (!data || data.length === 0) return [];

  const now = new Date();
  let cutoff;

  switch (range) {
    case "1D":
      return data.slice(0, 78); // ~78 5-min bars in a trading day
    case "1W":
      cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
      break;
    case "1M":
      cutoff = new Date(now);
      cutoff.setMonth(cutoff.getMonth() - 1);
      break;
    case "3M":
      cutoff = new Date(now);
      cutoff.setMonth(cutoff.getMonth() - 3);
      break;
    case "1Y":
      cutoff = new Date(now);
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      break;
    case "5Y":
      cutoff = new Date(now);
      cutoff.setFullYear(cutoff.getFullYear() - 5);
      break;
    default:
      return data;
  }

  return data.filter((d) => new Date(d.date) >= cutoff).reverse();
};

const PriceChart = ({
  dailyData = [],
  intradayData = [],
  onRangeChange,
  selectedRange: externalRange,
}) => {
  const [internalRange, setInternalRange] = useState("1M");
  const selectedRange = externalRange || internalRange;

  const handleRangeChange = (range) => {
    setInternalRange(range);
    if (onRangeChange) onRangeChange(range);
  };

  const rawData = selectedRange === "1D" ? intradayData : dailyData;
  const chartData = filterDataByRange(rawData, selectedRange);

  if (!chartData || chartData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.chartArea, styles.emptyChart]}>
          <Text style={styles.emptyText}>No chart data available</Text>
        </View>
        <View style={styles.rangeSelector}>
          {TIME_RANGES.map((r) => (
            <TouchableOpacity
              key={r.key}
              style={[
                styles.rangeButton,
                selectedRange === r.key && styles.rangeButtonActive,
              ]}
              onPress={() => handleRangeChange(r.key)}
            >
              <Text
                style={[
                  styles.rangeText,
                  selectedRange === r.key && styles.rangeTextActive,
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  const prices = chartData.map((d) => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const isPositive = lastPrice >= firstPrice;
  const lineColor = isPositive ? "#34C759" : "#FF3B30";

  const chartWidth = SCREEN_WIDTH - CHART_PADDING * 2;
  const stepX = chartWidth / Math.max(prices.length - 1, 1);

  // Generate simple line using View components
  const points = prices.map((price, i) => ({
    x: i * stepX,
    y: CHART_HEIGHT - ((price - minPrice) / priceRange) * (CHART_HEIGHT - 20) - 10,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.chartArea}>
        {/* Price labels */}
        <View style={styles.priceLabels}>
          <Text style={styles.priceLabel}>${maxPrice.toFixed(2)}</Text>
          <Text style={styles.priceLabel}>
            ${((maxPrice + minPrice) / 2).toFixed(2)}
          </Text>
          <Text style={styles.priceLabel}>${minPrice.toFixed(2)}</Text>
        </View>

        {/* Chart lines */}
        <View style={styles.chartCanvas}>
          {points.map((point, i) => {
            if (i === 0) return null;
            const prev = points[i - 1];
            const dx = point.x - prev.x;
            const dy = point.y - prev.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            return (
              <View
                key={i}
                style={{
                  position: "absolute",
                  left: prev.x,
                  top: prev.y,
                  width: length,
                  height: 2,
                  backgroundColor: lineColor,
                  transform: [{ rotate: `${angle}deg` }],
                  transformOrigin: "left center",
                }}
              />
            );
          })}
        </View>
      </View>

      {/* Time range selector */}
      <View style={styles.rangeSelector}>
        {TIME_RANGES.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[
              styles.rangeButton,
              selectedRange === r.key && styles.rangeButtonActive,
            ]}
            onPress={() => handleRangeChange(r.key)}
          >
            <Text
              style={[
                styles.rangeText,
                selectedRange === r.key && styles.rangeTextActive,
              ]}
            >
              {r.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  chartArea: {
    height: CHART_HEIGHT,
    marginHorizontal: CHART_PADDING,
    flexDirection: "row",
  },
  emptyChart: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  priceLabels: {
    width: 70,
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  priceLabel: {
    fontSize: 11,
    color: "#8E8E93",
  },
  chartCanvas: {
    flex: 1,
    height: CHART_HEIGHT,
  },
  rangeSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: CHART_PADDING,
    paddingTop: 12,
  },
  rangeButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  rangeButtonActive: {
    backgroundColor: "#007AFF",
  },
  rangeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  rangeTextActive: {
    color: "#fff",
  },
});

export default PriceChart;
