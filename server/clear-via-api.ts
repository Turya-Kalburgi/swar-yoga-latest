import express, { Request, Response, Router } from 'express';
import connectDB from './config/db.js';

const router: Router = express.Router();

/**
 * DELETE /api/admin/clear-all-data
 * DANGEROUS: Clears all collections except for critical system data
 * This is a destructive operation - use with caution!
 */
router.delete('/clear-all-data', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('⚠️  Starting database cleanup...');
    
    const collections = [
      'users',
      'visions',
      'goals',
      'tasks',
      'todos',
      'mywords',
      'healthtrackers',
      'workshops',
      'contacts',
      'carts',
      'checkouts',
      'transactions',
      'signupdatas',
      'signindatas',
      'milestones',
      'reminders',
      'dailyplans'
    ];
    
    const deleteResults: { [key: string]: number } = {};
    
    for (const collectionName of collections) {
      try {
        const collection = await import('mongoose').then(m => m.default.connection.collection(collectionName));
        const result = await collection.deleteMany({});
        deleteResults[collectionName] = result.deletedCount;
        console.log(`✅ ${collectionName}: Deleted ${result.deletedCount} documents`);
      } catch (err) {
        console.log(`⚠️  ${collectionName}: Error or doesn't exist`);
      }
    }
    
    res.json({
      success: true,
      message: 'Database cleared successfully',
      deletedCollections: deleteResults,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

export default router;
