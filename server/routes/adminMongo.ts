import express, { Request, Response, Router } from 'express';
import SignupData from '../models/SignupData.js';
import SigninData from '../models/SigninData.js';
import Contact from '../models/Contact.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import Workshop from '../models/Workshop.js';
import Vision from '../models/Vision.js';
import Goal from '../models/Goal.js';
import Task from '../models/Task.js';
import Todo from '../models/Todo.js';
import Checkout from '../models/Checkout.js';
import { Transaction } from '../models/Accounting.js';
import HealthTracker from '../models/HealthTracker.js';
import type { ISignupData } from '../models/SignupData.js';
import type { ISigninData } from '../models/SigninData.js';
import type { IContact } from '../models/Contact.js';
import type { ICart } from '../models/Cart.js';
import type { IUser } from '../models/User.js';
import type { IWorkshop } from '../models/Workshop.js';

const router: Router = express.Router();

// ===== TYPE DEFINITIONS =====

interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
}

interface DashboardStats {
  summary: {
    totalSignups: number;
    totalSignins: number;
    totalContacts: number;
    totalCarts: number;
    totalUsers: number;
    totalWorkshops: number;
    totalVisions: number;
    totalGoals: number;
    totalTasks: number;
    totalTodos: number;
    totalCheckouts: number;
    totalTransactions: number;
    totalHealthRecords: number;
  };
  recentSignups: Partial<ISignupData>[];
  recentContacts: Partial<IContact>[];
  workshopStats: {
    totalEnrolled: number;
    avgRating: number;
  };
  financialStats: {
    totalRevenue: number;
    totalExpense: number;
    netBalance: number;
  };
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ===== DASHBOARD STATS =====
/**
 * GET /api/admin/dashboard-stats
 * Get aggregated statistics for admin dashboard (NO userId filtering)
 */
router.get('/dashboard-stats', async (req: Request, res: Response<{ success: boolean; data: DashboardStats }>): Promise<void> => {
  try {
    console.log('📊 Fetching admin dashboard statistics from MongoDB');

    const [
      totalSignups,
      totalSignins,
      totalContacts,
      totalCarts,
      totalUsers,
      totalWorkshops,
      totalVisions,
      totalGoals,
      totalTasks,
      totalTodos,
      totalCheckouts,
      totalTransactions,
      totalHealthRecords,
    ] = await Promise.all([
      SignupData.countDocuments(),
      SigninData.countDocuments(),
      Contact.countDocuments(),
      Cart.countDocuments(),
      User.countDocuments(),
      Workshop.countDocuments(),
      Vision.countDocuments(),
      Goal.countDocuments(),
      Task.countDocuments(),
      Todo.countDocuments(),
      Checkout.countDocuments(),
      Transaction.countDocuments(),
      HealthTracker.countDocuments(),
    ]);

    // Get recent signups
    const recentSignups = await SignupData.find().sort({ createdAt: -1 }).limit(10).lean();

    // Get recent contacts
    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(10).lean();

    // Get workshop stats
    const workshopStats = await Workshop.aggregate([
      {
        $group: {
          _id: null,
          totalEnrolled: { $sum: '$enrolledCount' },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    // Get financial stats
    const financialData = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
        },
      },
    ]);

    console.log('✅ Dashboard stats retrieved from MongoDB');

    const data: DashboardStats = {
      summary: {
        totalSignups,
        totalSignins,
        totalContacts,
        totalCarts,
        totalUsers,
        totalWorkshops,
        totalVisions,
        totalGoals,
        totalTasks,
        totalTodos,
        totalCheckouts,
        totalTransactions,
        totalHealthRecords,
      },
      recentSignups,
      recentContacts,
      workshopStats: workshopStats[0] || { totalEnrolled: 0, avgRating: 0 },
      financialStats: {
        totalRevenue: financialData[0]?.totalIncome || 0,
        totalExpense: financialData[0]?.totalExpense || 0,
        netBalance: (financialData[0]?.totalIncome || 0) - (financialData[0]?.totalExpense || 0),
      },
    };

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching dashboard stats:', errorMessage);
    res.status(500).json({
      success: false,
      data: {} as DashboardStats,
    } as any);
  }
});

// ===== SIGNUPS =====
/**
 * GET /api/admin/signups
 * Get all signup data (aggregated from all users)
 */
router.get('/signups', async (req: Request<any, any, any, PaginationQuery>, res: Response<PaginatedResponse<ISignupData>>): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    console.log(`📖 Fetching all signup data (page ${page})`);

    const [signups, total] = await Promise.all([
      SignupData.find().skip(skip).limit(limit).lean().sort({ createdAt: -1 }),
      SignupData.countDocuments(),
    ]);

    res.json({
      success: true,
      data: signups as ISignupData[],
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching signups:', errorMessage);
    res.status(500).json({
      success: false,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    } as any);
  }
});

// ===== SIGNINS =====
/**
 * GET /api/admin/signins
 * Get all signin data (aggregated from all users)
 */
router.get('/signins', async (req: Request<any, any, any, PaginationQuery>, res: Response<PaginatedResponse<ISigninData>>): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    console.log(`📖 Fetching all signin data (page ${page})`);

    const [signins, total] = await Promise.all([
      SigninData.find().skip(skip).limit(limit).lean().sort({ createdAt: -1 }),
      SigninData.countDocuments(),
    ]);

    res.json({
      success: true,
      data: signins as ISigninData[],
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching signins:', errorMessage);
    res.status(500).json({
      success: false,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    } as any);
  }
});

// ===== CONTACTS =====
/**
 * GET /api/admin/contacts
 * Get all contact messages (aggregated from all users)
 */
router.get('/contacts', async (req: Request<any, any, any, PaginationQuery>, res: Response<PaginatedResponse<IContact>>): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    console.log(`📖 Fetching all contacts (page ${page})`);

    const [contacts, total] = await Promise.all([
      Contact.find().skip(skip).limit(limit).lean().sort({ createdAt: -1 }),
      Contact.countDocuments(),
    ]);

    res.json({
      success: true,
      data: contacts as IContact[],
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching contacts:', errorMessage);
    res.status(500).json({
      success: false,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    } as any);
  }
});

// ===== CARTS =====
/**
 * GET /api/admin/carts
 * Get all cart data (aggregated from all users)
 */
router.get('/carts', async (req: Request<any, any, any, PaginationQuery>, res: Response<PaginatedResponse<ICart>>): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    console.log(`📖 Fetching all carts (page ${page})`);

    const [carts, total] = await Promise.all([
      Cart.find().skip(skip).limit(limit).lean().sort({ createdAt: -1 }),
      Cart.countDocuments(),
    ]);

    res.json({
      success: true,
      data: carts as ICart[],
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching carts:', errorMessage);
    res.status(500).json({
      success: false,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    } as any);
  }
});

// ===== USERS =====
/**
 * GET /api/admin/users
 * Get all user data (aggregated from all users)
 */
router.get('/users', async (req: Request<any, any, any, PaginationQuery>, res: Response<PaginatedResponse<Partial<IUser>>>): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    console.log(`📖 Fetching all users (page ${page})`);

    const [users, total] = await Promise.all([
      User.find().select('-password').skip(skip).limit(limit).lean().sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    res.json({
      success: true,
      data: users as Partial<IUser>[],
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching users:', errorMessage);
    res.status(500).json({
      success: false,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    } as any);
  }
});

// ===== WORKSHOPS =====
/**
 * GET /api/admin/workshops
 * Get all workshops
 */
router.get('/workshops', async (req: Request<any, any, any, PaginationQuery>, res: Response<PaginatedResponse<IWorkshop>>): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    console.log(`📖 Fetching all workshops (page ${page})`);

    const [workshops, total] = await Promise.all([
      Workshop.find().skip(skip).limit(limit).lean().sort({ startDate: -1 }),
      Workshop.countDocuments(),
    ]);

    res.json({
      success: true,
      data: workshops as IWorkshop[],
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching workshops:', errorMessage);
    res.status(500).json({
      success: false,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    } as any);
  }
});

export default router;
