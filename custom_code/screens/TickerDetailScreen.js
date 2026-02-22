import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import PriceChart from "../components/PriceChart";
import FinancialSummary from "../components/FinancialSummary";
import ShariahBadge from "../components/ShariahBadge";
import { ShariahBadgeSmall } from "../components/ShariahBadge";
import {
  getQuote,
  getProfile,
  getKeyMetrics,
  getHistoricalPrices,
  getIntradayPrices,
  getIncomeStatement,
} from "../services/fmpService";
import { getShariahDataBySymbol } from "../services/wordpressService";

const TickerDetailScreen = ({ navigation, route }) => {
  const { symbol, name } = route?.params || {};

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Financial data
  const [quote, setQuote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [keyMetrics, setKeyMetrics] = useState(null);
  const [incomeStatement, setIncomeStatement] = useState([]);
  const [dailyPrices, setDailyPrices] = useState([]);
  const [intradayPrices, setIntradayPrices] = useState([]);

  // Shariah data
  const [shariahData, setShariahData] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");

  const loadData = async (isRefresh = false) => {
    if (!symbol) return;

    if (!isRefresh) setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [
        quoteData,
        profileData,
        metricsData,
        dailyData,
        intradayData,
        incomeData,
        shariahResult,
      ] = await Promise.allSettled([
        getQuote(symbol),
        getProfile(symbol),
        getKeyMetrics(symbol),
        getHistoricalPrices(symbol),
        getIntradayPrices(symbol),
        getIncomeStatement(symbol, 4),
        getShariahDataBySymbol(symbol),
      ]);

      if (quoteData.status === "fulfilled") setQuote(quoteData.value);
      if (profileData.status === "fulfilled") setProfile(profileData.value);
      if (metricsData.status === "fulfilled") setKeyMetrics(metricsData.value);
      if (dailyData.status === "fulfilled") setDailyPrices(dailyData.value);
      if (intradayData.status === "fulfilled") setIntradayPrices(intradayData.value);
      if (incomeData.status === "fulfilled") setIncomeStatement(incomeData.value);
      if (shariahResult.status === "fulfilled") setShariahData(shariahResult.value);

      // If quote fails, that's a critical error
      if (quoteData.status === "rejected") {
        setError("Failed to load stock data. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while loading data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [symbol]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading {symbol}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !quote) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadData()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const priceChange = quote?.change || 0;
  const changePercent = quote?.changesPercentage || 0;
  const isPositive = priceChange >= 0;
  const changeColor = isPositive ? "#34C759" : "#FF3B30";

  // Determine overall Shariah status from AAOIFI
  const overallShariahStatus = shariahData?.standards?.aaoifi?.status;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.symbol}>{symbol}</Text>
              <Text style={styles.companyName} numberOfLines={1}>
                {profile?.companyName || name || ""}
              </Text>
            </View>
            {overallShariahStatus && (
              <ShariahBadgeSmall status={overallShariahStatus} />
            )}
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>
              ${quote?.price?.toFixed(2) || "—"}
            </Text>
            <View style={styles.changeRow}>
              <Text style={[styles.change, { color: changeColor }]}>
                {isPositive ? "+" : ""}
                {priceChange.toFixed(2)}
              </Text>
              <Text style={[styles.changePercent, { color: changeColor }]}>
                ({isPositive ? "+" : ""}
                {changePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Price Chart */}
        <PriceChart dailyData={dailyPrices} intradayData={intradayPrices} />

        {/* Tab Selector */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "overview" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("overview")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "overview" && styles.tabTextActive,
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "shariah" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("shariah")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "shariah" && styles.tabTextActive,
              ]}
            >
              Shariah
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "financials" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("financials")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "financials" && styles.tabTextActive,
              ]}
            >
              Financials
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <FinancialSummary
            quote={quote}
            profile={profile}
            keyMetrics={keyMetrics}
            incomeStatement={null}
          />
        )}

        {activeTab === "shariah" && <ShariahBadge shariahData={shariahData} />}

        {activeTab === "financials" && (
          <FinancialSummary
            quote={null}
            profile={null}
            keyMetrics={keyMetrics}
            incomeStatement={incomeStatement}
          />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  symbol: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
  },
  companyName: {
    fontSize: 15,
    color: "#8E8E93",
    marginTop: 2,
  },
  priceSection: {
    marginTop: 12,
  },
  price: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  change: {
    fontSize: 17,
    fontWeight: "600",
  },
  changePercent: {
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 6,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8E8E93",
  },
  tabTextActive: {
    color: "#007AFF",
  },
  bottomSpacer: {
    height: 40,
  },
});

export default TickerDetailScreen;
