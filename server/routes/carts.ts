import express, { Request, Response, Router } from 'express';
import Cart from '../models/Cart.js';
import type { ICart } from '../models/Cart.js';

const router: Router = express.Router();

function getUserIdFromHeaders(req: Request): string {
  return (req.headers['x-user-id'] as string) || req.params.userId || 'anonymous';
}

router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || getUserIdFromHeaders(req);
    console.log(`📖 Fetching cart for user: ${userId}`);

    let cart = await Cart.findOne({ userId }).populate('items.workshopId').lean();

    if (!cart) {
      cart = { userId, items: [], total: 0 } as any;
    }

    console.log(`✅ Retrieved cart with ${(cart as any).items?.length || 0} items`);
    res.json({ success: true, data: cart });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching cart:', errorMessage);
    res.status(500).json({ success: false, message: 'Failed to fetch cart', error: errorMessage });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserIdFromHeaders(req);
    const { workshopId, quantity = 1 } = req.body;

    console.log(`✍️ Adding item to cart for user: ${userId}`);

    if (!workshopId) {
      res.status(400).json({ success: false, message: 'workshopId is required' });
      return;
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => (item.workshopId as any).toString() === workshopId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ workshopId, quantity } as any);
    }

    await cart.save();

    console.log(`✅ Item added to cart. Total items: ${cart.items.length}`);
    res.json({ success: true, data: cart, message: 'Item added to cart' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error adding to cart:', errorMessage);
    res.status(500).json({ success: false, message: 'Failed to add to cart', error: errorMessage });
  }
});

router.put('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || getUserIdFromHeaders(req);
    const { items } = req.body;

    console.log(`🔄 Updating cart for user: ${userId}`);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: items || [] });
    } else {
      cart.items = items || [];
    }

    await cart.save();

    console.log(`✅ Cart updated with ${cart.items.length} items`);
    res.json({ success: true, data: cart, message: 'Cart updated successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error updating cart:', errorMessage);
    res.status(500).json({ success: false, message: 'Failed to update cart', error: errorMessage });
  }
});

router.delete('/:userId/:itemId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || getUserIdFromHeaders(req);
    const { itemId } = req.params;

    console.log(`🗑️ Removing item ${itemId} from cart for user: ${userId}`);

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter(item => (item.workshopId as any).toString() !== itemId);
    await cart.save();

    console.log(`✅ Item removed. Remaining items: ${cart.items.length}`);
    res.json({ success: true, data: cart, message: 'Item removed from cart' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error removing item:', errorMessage);
    res.status(500).json({ success: false, message: 'Failed to remove item', error: errorMessage });
  }
});

router.delete('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || getUserIdFromHeaders(req);

    console.log(`🗑️ Clearing cart for user: ${userId}`);

    await Cart.findOneAndDelete({ userId });

    console.log(`✅ Cart cleared`);
    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error clearing cart:', errorMessage);
    res.status(500).json({ success: false, message: 'Failed to clear cart', error: errorMessage });
  }
});

export default router;
