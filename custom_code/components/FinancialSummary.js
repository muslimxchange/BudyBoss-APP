import React from "react";
import { View, Text, StyleSheet } from "react-native";

const formatNumber = (num) => {
  if (num == null) return "—";
  if (Math.abs(num) >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (Math.abs(num) >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${Number(num).toLocaleString()}`;
};

const formatPercent = (val) => {
  if (val == null) return "—";
  return `${(Number(val) * 100).toFixed(2)}%`;
};

const formatRatio = (val) => {
  if (val == null) return "—";
  return Number(val).toFixed(2);
};

const MetricRow = ({ label, value }) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const FinancialSummary = ({ quote, profile, keyMetrics, incomeStatement }) => {
  return (
    <View style={styles.container}>
      {/* Price Overview */}
      <SectionHeader title="Price Overview" />
      <View style={styles.metricsCard}>
        <MetricRow label="Open" value={quote?.open ? `$${quote.open.toFixed(2)}` : "—"} />
        <MetricRow label="Previous Close" value={quote?.previousClose ? `$${quote.previousClose.toFixed(2)}` : "—"} />
        <MetricRow label="Day High" value={quote?.dayHigh ? `$${quote.dayHigh.toFixed(2)}` : "—"} />
        <MetricRow label="Day Low" value={quote?.dayLow ? `$${quote.dayLow.toFixed(2)}` : "—"} />
        <MetricRow label="52 Week High" value={quote?.yearHigh ? `$${quote.yearHigh.toFixed(2)}` : "—"} />
        <MetricRow label="52 Week Low" value={quote?.yearLow ? `$${quote.yearLow.toFixed(2)}` : "—"} />
        <MetricRow label="Volume" value={quote?.volume?.toLocaleString() || "—"} />
        <MetricRow label="Avg Volume" value={quote?.avgVolume?.toLocaleString() || "—"} />
      </View>

      {/* Key Metrics */}
      <SectionHeader title="Key Metrics" />
      <View style={styles.metricsCard}>
        <MetricRow label="Market Cap" value={formatNumber(quote?.marketCap)} />
        <MetricRow label="P/E Ratio" value={formatRatio(quote?.pe)} />
        <MetricRow label="EPS" value={quote?.eps ? `$${quote.eps.toFixed(2)}` : "—"} />
        <MetricRow
          label="Dividend Yield"
          value={keyMetrics?.dividendYield ? formatPercent(keyMetrics.dividendYield) : "—"}
        />
        <MetricRow
          label="Price to Book"
          value={formatRatio(keyMetrics?.pbRatio)}
        />
        <MetricRow
          label="Debt to Equity"
          value={formatRatio(keyMetrics?.debtToEquity)}
        />
        <MetricRow
          label="Current Ratio"
          value={formatRatio(keyMetrics?.currentRatio)}
        />
        <MetricRow
          label="ROE"
          value={keyMetrics?.roe ? formatPercent(keyMetrics.roe) : "—"}
        />
      </View>

      {/* Income Statement Summary */}
      {incomeStatement && incomeStatement.length > 0 && (
        <>
          <SectionHeader title="Income Statement (Annual)" />
          <View style={styles.metricsCard}>
            {incomeStatement.slice(0, 4).map((stmt, idx) => (
              <View key={idx} style={styles.incomeYear}>
                <Text style={styles.yearLabel}>
                  {stmt.calendarYear || stmt.date?.substring(0, 4)}
                </Text>
                <MetricRow label="Revenue" value={formatNumber(stmt.revenue)} />
                <MetricRow label="Net Income" value={formatNumber(stmt.netIncome)} />
                <MetricRow label="Gross Profit" value={formatNumber(stmt.grossProfit)} />
                <MetricRow label="EBITDA" value={formatNumber(stmt.ebitda)} />
                {idx < incomeStatement.length - 1 && <View style={styles.yearDivider} />}
              </View>
            ))}
          </View>
        </>
      )}

      {/* Company Info */}
      {profile && (
        <>
          <SectionHeader title="Company Info" />
          <View style={styles.metricsCard}>
            <MetricRow label="Sector" value={profile.sector || "—"} />
            <MetricRow label="Industry" value={profile.industry || "—"} />
            <MetricRow label="Exchange" value={profile.exchangeShortName || "—"} />
            <MetricRow label="Country" value={profile.country || "—"} />
            {profile.description && (
              <Text style={styles.description} numberOfLines={5}>
                {profile.description}
              </Text>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  metricsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F2F2F7",
  },
  metricLabel: {
    fontSize: 15,
    color: "#8E8E93",
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  incomeYear: {
    paddingVertical: 4,
  },
  yearLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#007AFF",
    paddingVertical: 6,
  },
  yearDivider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
    paddingVertical: 10,
  },
});

export default FinancialSummary;
