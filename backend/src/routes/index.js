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

// ── Module Routes (uncomment as each module is implemented) ──────────────────

// import authRouter        from '../modules/auth/auth.routes.js';
// import usersRouter       from '../modules/users/users.routes.js';
// import storesRouter      from '../modules/stores/stores.routes.js';
// import categoriesRouter  from '../modules/categories/categories.routes.js';
// import productsRouter    from '../modules/products/products.routes.js';
// import inventoryRouter   from '../modules/inventory/inventory.routes.js';
// import cartRouter        from '../modules/cart/cart.routes.js';
// import ordersRouter      from '../modules/orders/orders.routes.js';
// import deliveriesRouter  from '../modules/deliveries/deliveries.routes.js';
// import paymentsRouter    from '../modules/payments/payments.routes.js';
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

