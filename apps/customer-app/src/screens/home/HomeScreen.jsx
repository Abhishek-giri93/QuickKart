// Customer App — Home Screen (Enterprise Quick-Commerce Polish)

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, RefreshControl, Alert, Image,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { mockStores, mockCategories } from '../../mock-data/stores';
import { apiClient } from '../../services/apiClient';
import { ENDPOINTS } from '../../constants/api';


const PROMO_BANNERS = [
  {
    id: 'b1',
    code: 'QUICK50',
    title: 'FLAT 50% OFF',
    sub: 'Daily Groceries & Essentials',
    image: require('../../../assets/banners/offer-50.png'),
    badgeColor: '#FF6B35',
  },
  {
    id: 'b2',
    code: 'FREEDEL',
    title: 'Morning Breakfast',
    sub: 'Fresh Milk, Bread & Eggs in 10m',
    image: require('../../../assets/banners/breakfast.png'),
    badgeColor: '#0284C7',
  },
  {
    id: 'b3',
    code: 'WELCOME100',
    title: 'Festive Celebration',
    sub: 'Sweets, Snacks & Dry Fruits',
    image: require('../../../assets/banners/festival.png'),
    badgeColor: '#16A34A',
  },
];

const CATEGORY_ITEMS = [
  { id: 'all', name: 'All', icon: '⚡' },
  { id: 'grocery', name: 'Grocery', image: require('../../../assets/categories/grocery.png') },
  { id: 'dairy', name: 'Dairy & Milk', image: require('../../../assets/categories/dairy.png') },
  { id: 'veg', name: 'Vegetables', image: require('../../../assets/categories/vegetables.png') },
  { id: 'fruits', name: 'Fresh Fruits', image: require('../../../assets/categories/fruits.png') },
  { id: 'bread', name: 'Bakery', icon: '🍞' },
  { id: 'snacks', name: 'Snacks', icon: '🍿' },
];

export default function HomeScreen({ navigation }) {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
          category: s.category?.name || 'Groceries',
          rating: s.avgRating || 4.7,
          deliveryTime: 12,
          distance: 0.8,
          deliveryFee: 0,
          badge: '⚡ FASTEST (12 MINS)',
          isOpen: s.isOpen ?? true,
          tags: [s.category?.name || 'Groceries', 'Fast Delivery', 'Verified'],
          address: s.addressLine || 'Sector 4, Lakeview',
        }));
        setStores(formatted);
        setCategories([{ id: null, name: 'All', icon: '🌟' }, ...mockCategories]);
        setLoading(false);
        return;
      }
    } catch {
      // Fall through to mock data
    }

    setStores(mockStores);
    setCategories([{ id: null, name: 'All', icon: '🌟' }, ...mockCategories]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredStores = stores.filter((s) => {
    const matchesCat = !selectedCategory || s.category.toLowerCase().includes(selectedCategory.toLowerCase()) || s.tags?.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Top Location & Brand Bar */}
      <View style={styles.topHeader}>
        {/* Brand Row */}
        <View style={styles.brandRow}>
          <View style={styles.brandTitleContainer}>
            <Text style={styles.brandTextQ}>Quick</Text>
            <Text style={styles.brandTextK}>Kart</Text>
            <View style={styles.expressBadge}>
              <Text style={styles.expressBadgeText}>⚡ 10m</Text>
            </View>
          </View>
          <View style={styles.headerRightIcons}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => Alert.alert('Notifications', 'No unread notifications right now.')}
            >
              <Text style={{ fontSize: 16 }}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconCircle, { backgroundColor: '#FF6B35' }]}
              onPress={() => navigation?.navigate?.('Profile')}
            >
              <Text style={{ fontSize: 15 }}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Row */}
        <View style={styles.locationContainer}>
          <View style={styles.etaBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.etaText}>10 MINS DELIVERY</Text>
          </View>
          <TouchableOpacity
            style={styles.addressRow}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Delivery Address', 'Delivering to:\nFlat 402, Lakeview Enclave, Sector 4\n(Verified ⚡)')}
          >
            <Text style={styles.addressLabel}>Home — Flat 402, Sector 4</Text>
            <Text style={styles.addressChevron}>▾</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search 'milk, farm veggies, atta, bread'..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
              <Text style={{ color: '#64748B', fontWeight: '700', fontSize: 12 }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Quick Trending Keyword Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
          {['⚡ Amul Milk', '🍅 Farm Tomatoes', '🍞 Whole Wheat Bread', '🧂 Tata Salt', '🍪 Maggi'].map((k) => (
            <TouchableOpacity
              key={k}
              style={styles.trendingChip}
              onPress={() => setSearchQuery(k.replace(/^[^\s]+\s/, ''))}
            >
              <Text style={styles.trendingText}>{k}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promotional Hero Banners */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoBannersRow}>
          {PROMO_BANNERS.map((banner) => (
            <View key={banner.id} style={styles.promoCard}>
              <Image source={banner.image} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
              <View style={styles.promoCardOverlay} />
              <View style={styles.promoContent}>
                <View style={[styles.promoCodeBadge, { backgroundColor: banner.badgeColor }]}>
                  <Text style={styles.promoCodeText}>CODE: {banner.code}</Text>
                </View>
                <Text style={styles.promoTitle}>{banner.title}</Text>
                <Text style={styles.promoSub}>{banner.sub}</Text>
                <TouchableOpacity
                  style={styles.claimBtn}
                  activeOpacity={0.8}
                  onPress={() => Alert.alert('Offer Copied! 🎉', `Coupon ${banner.code} will be applied automatically at checkout.`)}
                >
                  <Text style={styles.claimBtnText}>Claim Offer →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Category Image Navigation */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORY_ITEMS.map((cat) => {
            const isSelected = selectedCategory === cat.name || (!selectedCategory && cat.name === 'All');
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCircleItem}
                onPress={() => setSelectedCategory(cat.name === 'All' ? null : cat.name)}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryCircleWrapper, isSelected && styles.categoryCircleWrapperActive]}>
                  {cat.image ? (
                    <Image source={cat.image} style={styles.categoryCircleImg} resizeMode="cover" />
                  ) : (
                    <Text style={styles.categoryCircleEmoji}>{cat.icon}</Text>
                  )}
                </View>
                <Text style={[styles.categoryCircleLabel, isSelected && styles.categoryCircleLabelActive]} numberOfLines={1}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Stores Section Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Featured Neighborhood Stores</Text>
            <Text style={styles.sectionSubtitle}>FSSAI verified • 10-15 minute doorstep delivery</Text>
          </View>
          <Text style={styles.storeCountBadge}>{filteredStores.length} stores</Text>
        </View>

        {/* Store Cards */}
        {filteredStores.map((store) => (
          <TouchableOpacity
            key={store.id}
            style={styles.storeCard}
            activeOpacity={0.9}
            onPress={() => navigation?.navigate?.('StoreDetail', { storeId: store.id, storeName: store.name })}
          >
            <View style={styles.storeCardHeader}>
              <View style={styles.storeAvatarBox}>
                <Text style={{ fontSize: 32 }}>🏪</Text>
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.storeName} numberOfLines={1}>{store.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {store.rating}</Text>
                  </View>
                </View>

                <Text style={styles.storeAddress} numberOfLines={1}>{store.address}</Text>

                <View style={styles.storeMetaRow}>
                  <View style={styles.badgeEta}>
                    <Text style={styles.badgeEtaText}>⚡ {store.deliveryTime} MINS</Text>
                  </View>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaDist}>📍 {store.distance} km</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <View style={styles.badgeFreeDel}>
                    <Text style={styles.badgeFreeDelText}>FREE DELIVERY</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Store Tags Bar */}
            <View style={styles.tagsContainer}>
              {store.tags?.map((t) => (
                <View key={t} style={styles.tagPill}>
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  promoBannersRow: {
    paddingHorizontal: Spacing.md,
    gap: 14,
    marginBottom: Spacing.md,
  },
  promoCard: {
    width: 300,
    height: 145,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    ...Shadow.md,
  },
  promoCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  promoContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  promoCodeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  promoCodeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  promoSub: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '500',
  },
  claimBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryScroll: {
    paddingHorizontal: Spacing.md,
    gap: 16,
    paddingVertical: 10,
  },
  categoryCircleItem: {
    alignItems: 'center',
    width: 68,
  },
  categoryCircleWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    ...Shadow.sm,
  },
  categoryCircleWrapperActive: {
    borderColor: Colors.primary,
    borderWidth: 2.5,
    backgroundColor: '#FFF7ED',
  },
  categoryCircleImg: {
    width: '100%',
    height: '100%',
  },
  categoryCircleEmoji: {
    fontSize: 26,
  },
  categoryCircleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginTop: 6,
    textAlign: 'center',
  },
  categoryCircleLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerLogo: {
    width: 140,
    height: 40,
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeader: {
    backgroundColor: '#0F172A',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  locationContainer: {
    flex: 1,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  etaText: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLabel: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  addressChevron: {
    color: Colors.primary,
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '700',
  },
  headerRightIcons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: Spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.xs,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text.primary,
  },
  clearSearchBtn: {
    padding: 6,
  },
  trendingRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: 8,
  },
  trendingChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trendingText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  promoBannersRow: {
    paddingHorizontal: Spacing.md,
    gap: 12,
    marginBottom: Spacing.md,
  },
  promoCard: {
    width: 280,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.sm,
  },
  promoCodeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  promoCodeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  promoSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  storeCountBadge: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  categoryScroll: {
    paddingHorizontal: Spacing.md,
    gap: 8,
    paddingVertical: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  storeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.md,
    marginTop: 10,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadow.sm,
  },
  storeCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  storeAvatarBox: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  storeName: {
    fontSize: FontSize.base,
    fontWeight: '800',
    color: Colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '800',
  },
  storeAddress: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  badgeEta: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeEtaText: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '800',
  },
  metaDot: {
    color: '#CBD5E1',
    marginHorizontal: 6,
    fontSize: 10,
  },
  metaDist: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  badgeFreeDel: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeFreeDelText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  tagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
});
