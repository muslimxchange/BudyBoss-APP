import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import SearchBar from "../components/SearchBar";
import StockListItem from "../components/StockListItem";
import { searchTickers } from "../services/fmpService";
import { getShariahDataBySymbol } from "../services/wordpressService";

const DEBOUNCE_MS = 400;

const StockSearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shariahMap, setShariahMap] = useState({});
  const debounceRef = useRef(null);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 1) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchTickers(searchQuery.trim());
      setResults(data || []);

      // Fetch Shariah status in background for displayed results
      if (data && data.length > 0) {
        const symbols = data.slice(0, 10).map((d) => d.symbol);
        fetchShariahStatuses(symbols);
      }
    } catch (err) {
      setError("Failed to search stocks. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchShariahStatuses = async (symbols) => {
    const promises = symbols.map(async (symbol) => {
      try {
        const data = await getShariahDataBySymbol(symbol);
        if (data && data.standards) {
          // Use AAOIFI as primary standard
          return { symbol, status: data.standards.aaoifi?.status };
        }
      } catch {
        // Shariah data may not exist for all tickers
      }
      return null;
    });

    const results = await Promise.all(promises);
    const newMap = {};
    results.forEach((r) => {
      if (r) newMap[r.symbol] = r.status;
    });

    setShariahMap((prev) => ({ ...prev, ...newMap }));
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, performSearch]);

  const handleStockPress = (item) => {
    navigation.navigate("TickerDetailScreen", {
      symbol: item.symbol,
      name: item.name,
    });
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError(null);
  };

  const renderItem = ({ item }) => (
    <StockListItem
      item={item}
      onPress={handleStockPress}
      shariahStatus={shariahMap[item.symbol]}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    if (query.length > 0 && results.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No stocks found for "{query}"</Text>
        </View>
      );
    }
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.placeholderTitle}>Search Stocks</Text>
        <Text style={styles.placeholderText}>
          Search by ticker symbol or company name to view financial data and
          Shariah compliance screening.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Stocks</Text>
        </View>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={() => performSearch(query)}
          onClear={handleClear}
          placeholder="Search ticker or company..."
        />

        {loading && (
          <View style={styles.loadingBar}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}

        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.symbol ? `${item.symbol}-${index}` : `result-${index}`
          }
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={results.length === 0 && styles.emptyList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </View>
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
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
  },
  loadingBar: {
    paddingVertical: 8,
    alignItems: "center",
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default StockSearchScreen;
