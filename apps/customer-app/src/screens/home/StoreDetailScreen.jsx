// Customer App — Store Detail Screen (Quick-Commerce Polish)

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { mockStores } from '../../mock-data/stores';
import { mockProducts } from '../../mock-data/products';
import { useCartStore } from '../../store/cartStore';

export default function StoreDetailScreen({ storeId = 'store_001', navigation, onGoToCart }) {
  const store = mockStores.find((s) => s.id === storeId) || mockStores[0];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart Store hooks
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQty = useCartStore((state) => state.updateQty);
  const clearCart = useCartStore((state) => state.clearCart);

  const cartItemCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartSubtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Products from this store
  const storeProducts = mockProducts.filter((p) => p.storeId === store.id || !p.storeId);

  // Extract unique categories for filter
  const categories = ['All', ...new Set(storeProducts.map((p) => p.category))];

  const filteredProducts = storeProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    const res = addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        imageUrl: product.imageUrl,
      },
      store.id,
      store.name
    );

    if (res?.storeConflict) {
      Alert.alert(
        'Start New Cart?',
        'Your cart already contains items from another store. Do you want to discard them and add this item?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Start New',
            onPress: () => {
              clearCart();
              addItem(
                {
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  unit: product.unit,
                },
                store.id,
                store.name
              );
            },
          },
        ]
      );
    }
  };

  const getItemQty = (productId) => {
    const found = cartItems.find((i) => i.productId === productId);
    return found ? found.qty : 0;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack?.()}
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={styles.navStoreTitle} numberOfLines={1}>{store.name}</Text>
          <Text style={styles.navStoreSub}>{store.deliveryTime} mins • {store.distance} km away</Text>
        </View>

        <TouchableOpacity
          style={styles.searchToggleBtn}
          onPress={() => Alert.alert('Share Store', `Sharing ${store.name} with friends!`)}
        >
          <Text style={{ fontSize: 18 }}>↗️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Store Profile Card */}
        <View style={styles.storeHeroCard}>
          <View style={styles.storeHeaderRow}>
            <View style={styles.storeEmojiBox}>
              <Text style={{ fontSize: 36 }}>🏪</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.storeTitle} numberOfLines={1}>{store.name}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {store.rating}</Text>
                </View>
              </View>
              <Text style={styles.storeAddress}>{store.address}</Text>
              <View style={styles.fssaiRow}>
                <Text style={styles.fssaiText}>FSSAI Lic. 22819001294812 ✅</Text>
              </View>
            </View>
          </View>

          {/* Feature Badges Strip */}
          <View style={styles.featuresStrip}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>{store.deliveryTime} Mins ETA</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🛵</Text>
              <Text style={styles.featureText}>Free Delivery on ₹199+</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🛡️</Text>
              <Text style={styles.featureText}>Verified Hygiene</Text>
            </View>
          </View>
        </View>

        {/* In-store Search Bar */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={`Search items in ${store.name}...`}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Horizontal Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryBtnText, selectedCategory === cat && styles.categoryBtnTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Products' : selectedCategory} ({filteredProducts.length})
          </Text>
        </View>

        {/* Product Cards List */}
        {filteredProducts.map((product) => {
          const qty = getItemQty(product.id);
          return (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productInfoCol}>
                <View style={styles.productBadgeRow}>
                  {product.discount > 0 ? (
                    <View style={styles.discountPill}>
                      <Text style={styles.discountPillText}>{product.discount}% OFF</Text>
                    </View>
                  ) : null}
                  <Text style={styles.unitText}>{product.unit}</Text>
                </View>

                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDesc} numberOfLines={2}>{product.description}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>₹{product.price}</Text>
                  {product.originalPrice > product.price ? (
                    <Text style={styles.originalPriceText}>₹{product.originalPrice}</Text>
                  ) : null}
                </View>
              </View>

              {/* Product Action & Image Column */}
              <View style={styles.productActionCol}>
                <View style={styles.productImageBox}>
                  <Text style={{ fontSize: 36 }}>{product.icon || '🛍️'}</Text>
                </View>

                {qty === 0 ? (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => handleAddToCart(product)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addBtnText}>+ ADD</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => updateQty(product.id, qty - 1)}
                    >
                      <Text style={styles.stepperBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperQty}>{qty}</Text>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => updateQty(product.id, qty + 1)}
                    >
                      <Text style={styles.stepperBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        <View style={{ height: cartItemCount > 0 ? 100 : 30 }} />
      </ScrollView>

      {/* Floating Bottom Cart Dock */}
      {cartItemCount > 0 && (
        <View style={styles.floatingCartDock}>
          <View style={styles.dockLeft}>
            <View style={styles.dockCountBadge}>
              <Text style={styles.dockCountText}>{cartItemCount} {cartItemCount === 1 ? 'ITEM' : 'ITEMS'}</Text>
            </View>
            <Text style={styles.dockPrice}>₹{cartSubtotal} <Text style={styles.dockTaxes}>plus taxes</Text></Text>
          </View>

          <TouchableOpacity
            style={styles.dockViewCartBtn}
            onPress={() => onGoToCart?.()}
            activeOpacity={0.85}
          >
            <Text style={styles.dockViewCartText}>View Cart →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navBar: {
    backgroundColor: '#0F172A',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  navStoreTitle: {
    color: '#FFFFFF',
    fontSize: FontSize.base,
    fontWeight: '800',
  },
  navStoreSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  searchToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  storeHeroCard: {
    backgroundColor: '#FFFFFF',
    margin: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.sm,
  },
  storeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  storeEmojiBox: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  storeTitle: {
    fontSize: FontSize.base,
    fontWeight: '800',
    color: Colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '800',
  },
  storeAddress: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  fssaiRow: {
    marginTop: 4,
  },
  fssaiText: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: '700',
  },
  featuresStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  featureDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#E2E8F0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.md,
    marginBottom: 8,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text.primary,
  },
  clearBtn: {
    padding: 6,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.md,
    gap: 8,
    paddingVertical: 8,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionHeader: {
    paddingHorizontal: Spacing.md,
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.md,
    marginBottom: 10,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadow.xs,
  },
  productInfoCol: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  productBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  discountPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountPillText: {
    color: '#15803D',
    fontSize: 9,
    fontWeight: '800',
  },
  unitText: {
    fontSize: 11,
    color: Colors.text.tertiary,
    fontWeight: '600',
  },
  productName: {
    fontSize: FontSize.base,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  productDesc: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 4,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 8,
  },
  priceText: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  originalPriceText: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  productActionCol: {
    alignItems: 'center',
    width: 90,
  },
  productImageBox: {
    width: 75,
    height: 75,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addBtn: {
    backgroundColor: '#FFF7ED',
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '100%',
  },
  addBtnText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: 6,
    width: '100%',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  stepperBtn: {
    paddingHorizontal: 8,
  },
  stepperBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  stepperQty: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  floatingCartDock: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.lg,
  },
  dockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dockCountBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  dockCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dockPrice: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  dockTaxes: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '400',
  },
  dockViewCartBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dockViewCartText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: FontSize.sm,
  },
});
