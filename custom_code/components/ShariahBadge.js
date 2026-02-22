import React from "react";
import { View, Text, StyleSheet } from "react-native";

const STATUS_COLORS = {
  compliant: { bg: "#D1FAE5", text: "#065F46", label: "Halal" },
  "non-compliant": { bg: "#FEE2E2", text: "#991B1B", label: "Not Halal" },
  doubtful: { bg: "#FEF3C7", text: "#92400E", label: "Doubtful" },
  unknown: { bg: "#F3F4F6", text: "#6B7280", label: "Unknown" },
};

const normalizeStatus = (status) => {
  if (!status) return "unknown";
  const s = status.toLowerCase().trim();
  if (s === "halal" || s === "compliant" || s === "yes" || s === "pass")
    return "compliant";
  if (
    s === "not halal" ||
    s === "non-compliant" ||
    s === "haram" ||
    s === "no" ||
    s === "fail"
  )
    return "non-compliant";
  if (s === "doubtful" || s === "questionable" || s === "mixed")
    return "doubtful";
  return "unknown";
};

// Small inline badge
export const ShariahBadgeSmall = ({ status }) => {
  const normalized = normalizeStatus(status);
  const colors = STATUS_COLORS[normalized];

  return (
    <View style={[styles.smallBadge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.smallBadgeText, { color: colors.text }]}>
        {colors.label}
      </Text>
    </View>
  );
};

// Full Shariah compliance card
const ShariahBadge = ({ shariahData }) => {
  if (!shariahData) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Shariah Compliance</Text>
        <View style={styles.card}>
          <Text style={styles.noData}>
            No Shariah screening data available for this stock.
          </Text>
        </View>
      </View>
    );
  }

  const { standards, purificationPerShare, zakatPerShare, impureIncomePercent, debtLevel } =
    shariahData;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shariah Compliance</Text>

      {/* Standards Grid */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>Screening Standards</Text>
        {standards &&
          Object.values(standards).map((standard, idx) => {
            const normalized = normalizeStatus(standard.status);
            const colors = STATUS_COLORS[normalized];
            return (
              <View key={idx} style={styles.standardRow}>
                <Text style={styles.standardLabel}>{standard.label}</Text>
                <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                  <Text style={[styles.statusText, { color: colors.text }]}>
                    {colors.label}
                  </Text>
                </View>
              </View>
            );
          })}
      </View>

      {/* Financial Screening Values */}
      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.subHeader}>Financial Screening</Text>

        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>Purification / Share</Text>
          <Text style={styles.valueText}>
            {purificationPerShare != null
              ? `$${Number(purificationPerShare).toFixed(4)}`
              : "—"}
          </Text>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>Zakat / Share</Text>
          <Text style={styles.valueText}>
            {zakatPerShare != null
              ? `$${Number(zakatPerShare).toFixed(4)}`
              : "—"}
          </Text>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>Impure Income</Text>
          <Text
            style={[
              styles.valueText,
              impureIncomePercent > 5 && { color: "#FF3B30" },
            ]}
          >
            {impureIncomePercent != null
              ? `${Number(impureIncomePercent).toFixed(2)}%`
              : "—"}
          </Text>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>Debt Level</Text>
          <Text
            style={[
              styles.valueText,
              debtLevel > 33 && { color: "#FF3B30" },
            ]}
          >
            {debtLevel != null
              ? `${Number(debtLevel).toFixed(2)}%`
              : "—"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  subHeader: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3C3C43",
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  noData: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    paddingVertical: 16,
  },
  standardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F2F2F7",
  },
  standardLabel: {
    fontSize: 15,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F2F2F7",
  },
  valueLabel: {
    fontSize: 15,
    color: "#8E8E93",
  },
  valueText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  smallBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  smallBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ShariahBadge;
