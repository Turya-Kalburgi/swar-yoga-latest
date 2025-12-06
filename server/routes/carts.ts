import express, { Request, Response, Router } from 'express';
import Cart from '../models/Cart.js';
import type { ICart } from '../models/Cart.js';

const router: Router = express.Router();

function getUserIdFromHeaders(req: Request): string {
  return (req.headers['x-user-id'] as string) || req.params.userId || 'anonymous';
}

router.get('/:userIdentifier', async (req: Request, res: Response): Promise<void> => {
  try {
    const userIdentifier = req.params.userIdentifier || getUserIdFromHeaders(req);
    console.log(`📖 Fetching cart for user: ${userIdentifier}`);

    // Find by userId OR email
    let cart = await Cart.findOne({ 
      $or: [
        { userId: userIdentifier },
        { email: userIdentifier }
      ]
    }).lean();

    if (!cart) {
      // Return empty cart structure
      cart = { 
        userId: userIdentifier, 
        email: userIdentifier,
        items: [], 
        totalItems: 0,
        totalPrice: 0,
        status: 'active'
      } as any;
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
    const { 
      email, 
      workshopId, 
      workshopTitle, 
      instructor, 
      price, 
      quantity = 1,
      currency = 'INR',
      image
    } = req.body;

    console.log(`✍️ Adding item to cart for user: ${userId}`);

    if (!workshopId || !workshopTitle || !instructor || !price) {
      res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: workshopId, workshopTitle, instructor, price' 
      });
      return;
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ 
        userId, 
        email: email || userId, 
        items: [],
        status: 'active'
      });
    }

    // Check if item already exists
    const existingItem = cart.items.find(item => item.workshopId === workshopId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.addedAt = new Date();
    } else {
      cart.items.push({
        workshopId,
        workshopTitle,
        instructor,
        price,
        currency,
        quantity,
        image: image || null,
        addedAt: new Date()
      });
    }

    // Calculate totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.lastModified = new Date();

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
