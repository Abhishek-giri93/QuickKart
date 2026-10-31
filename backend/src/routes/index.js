/**
 * QuickKart API — Main Router
 *
 * This is the single entry point for all API routes.
 * All module routers are mounted here under versioned paths (/api/v1/...).
 *
 * Adding a new module:
 *   1. Create the router in src/modules/<module>/<module>.routes.js
 *   2. Import it here
 *   3. Mount it with app.use('/api/v1/<module>', router)
 */

import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';

const router = Router();

// ── Health Check ──────────────────────────────────────────────────────────────
// Used by monitoring tools, CI/CD pipelines and the frontend to check
// whether the API is up and the database is reachable.
router.get('/health', async (req, res) => {
  sendSuccess(res, {
    message: 'QuickKart API is running',
    data: {
      status: 'ok',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      version: 'v1',
    },
  });
});

// ── Module Routes ────────────────────────────────────────────────────────────
import authRouter from '../modules/auth/auth.routes.js';
import customerRouter from '../modules/users/customer.routes.js';
import sellerRouter from '../modules/users/seller.routes.js';
import deliveryPartnerRouter from '../modules/users/deliveryPartner.routes.js';
import categoryRouter from '../modules/categories/category.routes.js';
import storeRouter from '../modules/stores/store.routes.js';
import productRouter from '../modules/products/product.routes.js';
import inventoryRouter from '../modules/inventory/inventory.routes.js';
import cartRouter from '../modules/cart/cart.routes.js';
import orderRouter from '../modules/orders/order.routes.js';
import deliveryRouter from '../modules/deliveries/delivery.routes.js';
import paymentRouter from '../modules/payments/payment.routes.js';
import notificationRouter from '../modules/notifications/notification.routes.js';

router.use('/auth', authRouter);
router.use('/customers', customerRouter);
router.use('/sellers', sellerRouter);
router.use('/delivery-partners', deliveryPartnerRouter);
router.use('/categories', categoryRouter);
router.use('/stores', storeRouter);
router.use('/products', productRouter);
router.use('/inventory', inventoryRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);
router.use('/deliveries', deliveryRouter);
router.use('/payments', paymentRouter);
router.use('/notifications', notificationRouter);

// import reviewsRouter     from '../modules/reviews/reviews.routes.js';
// import couponsRouter     from '../modules/coupons/coupons.routes.js';
// import notificationsRouter from '../modules/notifications/notifications.routes.js';
// import supportRouter     from '../modules/support/support.routes.js';
// import adminRouter       from '../modules/admin/admin.routes.js';

// router.use('/auth',          authRouter);
// router.use('/users',         usersRouter);
// router.use('/stores',        storesRouter);
// router.use('/categories',    categoriesRouter);
// router.use('/products',      productsRouter);
// router.use('/inventory',     inventoryRouter);
// router.use('/cart',          cartRouter);
// router.use('/orders',        ordersRouter);
// router.use('/deliveries',    deliveriesRouter);
// router.use('/payments',      paymentsRouter);
// router.use('/reviews',       reviewsRouter);
// router.use('/coupons',       couponsRouter);
// router.use('/notifications', notificationsRouter);
// router.use('/support',       supportRouter);
// router.use('/admin',         adminRouter);

export default router;

