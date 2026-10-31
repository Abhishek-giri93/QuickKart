// Customer App — Home Screen

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, StatusBar, RefreshControl,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { mockStores, mockCategories } from '../../mock-data/stores';
import { apiClient } from '../../services/apiClient';
import { ENDPOINTS } from '../../constants/api';

// --- Sub-components ---

const Header = ({ onSearchPress }) => (
  <View style={headerStyles.container}>
    <View>
      <Text style={headerStyles.greeting}>Good morning! 👋</Text>
      <TouchableOpacity style={headerStyles.locationRow}>
        <Text style={headerStyles.locationIcon}>📍</Text>
        <Text style={headerStyles.locationText}>Select Location</Text>
        <Text style={headerStyles.chevron}>▾</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={headerStyles.notifBtn}>
      <Text style={{ fontSize: 22 }}>🔔</Text>
    </TouchableOpacity>
  </View>
);

const SearchBar = ({ onPress }) => (
  <TouchableOpacity style={searchStyles.bar} onPress={onPress} activeOpacity={0.8}>
    <Text style={searchStyles.icon}>🔍</Text>
    <Text style={searchStyles.placeholder}>Search stores, products...</Text>
  </TouchableOpacity>
);

const CategoryChip = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    style={[chipStyles.chip, isSelected && { backgroundColor: Colors.primary }]}
    onPress={onPress}
  >
    <Text style={chipStyles.icon}>{item.icon}</Text>
    <Text style={[chipStyles.label, isSelected && { color: '#FFF' }]}>{item.name}</Text>
  </TouchableOpacity>
);

const StoreCard = ({ store, onPress }) => (
  <TouchableOpacity style={cardStyles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={cardStyles.imagePlaceholder}>
      <Text style={{ fontSize: 36 }}>🏪</Text>
    </View>
    <View style={cardStyles.info}>
      <Text style={cardStyles.name} numberOfLines={1}>{store.name}</Text>
      <Text style={cardStyles.tags} numberOfLines={1}>{store.tags.join(' • ')}</Text>
      <View style={cardStyles.meta}>
        <Text style={cardStyles.rating}>⭐ {store.rating}</Text>
        <Text style={cardStyles.dot}> · </Text>
        <Text style={cardStyles.time}>🕐 {store.deliveryTime} min</Text>
        <Text style={cardStyles.dot}> · </Text>
        <Text style={cardStyles.distance}>📍 {store.distance} km</Text>
      </View>
      {store.deliveryFee === 0 ? (
        <Text style={cardStyles.freeDelivery}>Free Delivery</Text>
      ) : (
        <Text style={cardStyles.deliveryFee}>Delivery ₹{store.deliveryFee}</Text>
      )}
      {!store.isOpen && (
        <View style={cardStyles.closedBadge}>
          <Text style={cardStyles.closedText}>Closed</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

// --- Main Screen ---

const HomeScreen = ({ navigation }) => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.STORES.DISCOVER);
      const storeList = res?.data?.stores || res?.data || [];
      if (storeList.length > 0) {
        const formatted = storeList.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category?.name || 'General',
          rating: s.avgRating || 4.5,
          deliveryTime: 20,
          distance: 1.2,
          deliveryFee: 0,
          isOpen: s.isOpen ?? true,
          tags: [s.category?.name || 'Grocery', 'Fast Delivery'],
        }));
        setStores(formatted);
        setCategories([{ id: null, name: 'All', icon: '🌟' }, ...mockCategories]);
        setLoading(false);
        return;
      }
    } catch {
      // Fall through to mock data
    }
    await new Promise((r) => setTimeout(r, 600));
    setStores(mockStores);
    setCategories([{ id: null, name: 'All', icon: '🌟' }, ...mockCategories]);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredStores = selectedCategory
    ? stores.filter((s) => s.category === selectedCategory)
    : stores;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Header */}
        <Header />

        {/* Search Bar */}
        <View style={{ paddingHorizontal: Spacing.md, marginBottom: Spacing.md }}>
          <SearchBar onPress={() => navigation.navigate('Search')} />
        </View>

        {/* Banner / Promo */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>🎉 Free delivery on your first order!</Text>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: Spacing.xs }}
          renderItem={({ item }) => (
            <CategoryChip
              item={item}
              isSelected={selectedCategory === item.id}
              onPress={() => setSelectedCategory(item.id === selectedCategory ? null : item.id)}
            />
          )}
        />

        {/* Nearby Stores */}
        <View style={styles.storesSection}>
          <Text style={styles.sectionTitle}>Nearby Stores</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading stores...</Text>
          ) : filteredStores.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏪</Text>
              <Text style={styles.emptyText}>No stores found in this category</Text>
            </View>
          ) : (
            filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onPress={() => navigation.navigate('StoreDetail', { storeId: store.id, storeName: store.name })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// Styles
const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: Spacing.md, paddingTop: Spacing.xl, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
  },
  greeting: { fontSize: FontSize.sm, color: Colors.text.secondary, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationIcon: { fontSize: 16, marginRight: 4 },
  locationText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text.primary },
  chevron: { fontSize: 14, color: Colors.primary, marginLeft: 4 },
  notifBtn: { padding: Spacing.xs },
});

const searchStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.sm, height: 48,
    borderWidth: 1, borderColor: Colors.border,
  },
  icon: { fontSize: 18, marginRight: Spacing.xs },
  placeholder: { fontSize: FontSize.base, color: Colors.text.tertiary },
});

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs, borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surfaceSecondary, borderWidth: 1, borderColor: Colors.border,
  },
  icon: { fontSize: 16, marginRight: 4 },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.text.primary },
});

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md, ...Shadow.sm, overflow: 'hidden',
  },
  imagePlaceholder: {
    width: 100, height: 100, backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1, padding: Spacing.sm },
  name: { fontSize: FontSize.md, fontWeight: FontWeight.semiBold, color: Colors.text.primary },
  tags: { fontSize: FontSize.xs, color: Colors.text.tertiary, marginTop: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs },
  rating: { fontSize: FontSize.xs, color: Colors.text.secondary },
  dot: { color: Colors.text.tertiary },
  time: { fontSize: FontSize.xs, color: Colors.text.secondary },
  distance: { fontSize: FontSize.xs, color: Colors.text.secondary },
  freeDelivery: { fontSize: FontSize.xs, color: Colors.status.success, marginTop: 4, fontWeight: FontWeight.medium },
  deliveryFee: { fontSize: FontSize.xs, color: Colors.text.tertiary, marginTop: 4 },
  closedBadge: {
    position: 'absolute', top: Spacing.xs, right: Spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: BorderRadius.xs, paddingHorizontal: 6, paddingVertical: 2,
  },
  closedText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: FontWeight.medium },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  banner: {
    marginHorizontal: Spacing.md, marginBottom: Spacing.md,
    backgroundColor: Colors.primary + '15', borderRadius: BorderRadius.sm,
    padding: Spacing.sm, borderLeftWidth: 3, borderLeftColor: Colors.primary,
  },
  bannerText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },
  sectionTitle: {
    fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text.primary,
    paddingHorizontal: Spacing.md, marginBottom: Spacing.sm, marginTop: Spacing.md,
  },
  storesSection: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  loadingText: { textAlign: 'center', color: Colors.text.tertiary, marginTop: Spacing.xl },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.huge },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontSize: FontSize.base, color: Colors.text.tertiary },
});

export default HomeScreen;

