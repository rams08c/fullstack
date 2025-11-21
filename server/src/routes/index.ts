import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import profileRoutes from './profile.routes';
import categoryRoutes from './category.routes';
import transactionRoutes from './transaction.routes';

const router = Router();
// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profile', profileRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);

export default router;
