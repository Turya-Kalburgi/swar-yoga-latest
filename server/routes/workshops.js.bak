import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * TypeScript Types for Workshop Management
 */
export interface WorkshopBatch {
  id: string;
  title: string;
  instructor: string;
  startDate: string;
  endDate: string;
  duration: string;
  startTime: string;
  endTime: string;
  priceINR: number;
  priceNPR: number;
  priceUSD: number;
  maxParticipants: number;
  enrolledCount?: number;
  category: string;
  mode: string;
  language: string;
  level: string;
  location: string;
  image?: string;
  youtubeId?: string;
  paymentLinkINR?: string;
  paymentLinkNPR?: string;
  paymentLinkUSD?: string;
  prerequisites?: string;
  learningOutcomes?: string;
  includedItems?: string;
  remarks?: string;
  isPublic: boolean;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

interface WorkshopsData {
  workshops: WorkshopBatch[];
}

/**
 * Get the workshops JSON file path
 */
function getWorkshopsFilePath(): string {
  // server-data.json is at /project 13/server-data.json
  return path.resolve(__dirname, '../../server-data.json');
}

/**
 * Read all workshops from file or Supabase
 */
async function readWorkshops(): Promise<WorkshopBatch[]> {
  try {
    const filePath = getWorkshopsFilePath();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent) as WorkshopsData;
    return data.workshops || [];
  } catch (error) {
    console.log('Could not read workshops file, returning empty array:', error);
    return [];
  }
}

/**
 * Write workshops to file
 */
async function writeWorkshops(workshops: WorkshopBatch[]): Promise<void> {
  try {
    const filePath = getWorkshopsFilePath();
    const data: WorkshopsData = { workshops };
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing workshops to file:', error);
    throw error;
  }
}

/**
 * GET /api/admin/workshops
 * Retrieve all workshops
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const workshops = await readWorkshops();
    res.json({
      success: true,
      data: workshops,
      count: workshops.length
    });
  } catch (error) {
    console.error('Error retrieving workshops:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve workshops'
    });
  }
});

/**
 * GET /api/admin/workshops/public
 * Retrieve only public workshops (for frontend)
 */
router.get('/public', async (req: Request, res: Response) => {
  try {
    const workshops = await readWorkshops();
    const publicWorkshops = workshops.filter(w => w.isPublic);
    res.json({
      success: true,
      data: publicWorkshops,
      count: publicWorkshops.length
    });
  } catch (error) {
    console.error('Error retrieving public workshops:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve public workshops'
    });
  }
});

/**
 * POST /api/admin/workshops
 * Create a new workshop batch
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const batch = req.body as Omit<WorkshopBatch, 'id' | 'created_at' | 'updated_at'>;

    // Validate required fields
    if (!batch.title || !batch.instructor || !batch.startDate || !batch.endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, instructor, startDate, endDate'
      });
    }

    // Create new workshop with ID
    const newWorkshop: WorkshopBatch = {
      ...batch,
      id: Date.now().toString(),
      enrolledCount: batch.enrolledCount || 0,
      rating: batch.rating || 4.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Read existing workshops
    const workshops = await readWorkshops();

    // Add new workshop
    workshops.unshift(newWorkshop);

    // Write back to file
    await writeWorkshops(workshops);

    res.status(201).json({
      success: true,
      message: 'Workshop created successfully',
      data: newWorkshop
    });
  } catch (error) {
    console.error('Error creating workshop:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create workshop'
    });
  }
});

/**
 * GET /api/admin/workshops/:id
 * Retrieve a single workshop by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workshops = await readWorkshops();
    const workshop = workshops.find(w => w.id === id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        error: 'Workshop not found'
      });
    }

    res.json({
      success: true,
      data: workshop
    });
  } catch (error) {
    console.error('Error retrieving workshop:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve workshop'
    });
  }
});

/**
 * PUT /api/admin/workshops/:id
 * Update a workshop
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body as Partial<WorkshopBatch>;

    const workshops = await readWorkshops();
    const index = workshops.findIndex(w => w.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Workshop not found'
      });
    }

    // Update workshop
    workshops[index] = {
      ...workshops[index],
      ...updates,
      id: workshops[index].id, // Don't allow changing ID
      created_at: workshops[index].created_at, // Don't change creation date
      updated_at: new Date().toISOString()
    };

    await writeWorkshops(workshops);

    res.json({
      success: true,
      message: 'Workshop updated successfully',
      data: workshops[index]
    });
  } catch (error) {
    console.error('Error updating workshop:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update workshop'
    });
  }
});

/**
 * DELETE /api/admin/workshops/:id
 * Delete a workshop
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workshops = await readWorkshops();
    const index = workshops.findIndex(w => w.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Workshop not found'
      });
    }

    const deletedWorkshop = workshops.splice(index, 1)[0];
    await writeWorkshops(workshops);

    res.json({
      success: true,
      message: 'Workshop deleted successfully',
      data: deletedWorkshop
    });
  } catch (error) {
    console.error('Error deleting workshop:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete workshop'
    });
  }
});

/**
 * PATCH /api/admin/workshops/:id/visibility
 * Toggle workshop public/private visibility
 */
router.patch('/:id/visibility', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workshops = await readWorkshops();
    const workshop = workshops.find(w => w.id === id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        error: 'Workshop not found'
      });
    }

    // Toggle visibility
    workshop.isPublic = !workshop.isPublic;
    workshop.updated_at = new Date().toISOString();

    await writeWorkshops(workshops);

    res.json({
      success: true,
      message: `Workshop is now ${workshop.isPublic ? 'public' : 'private'}`,
      data: workshop
    });
  } catch (error) {
    console.error('Error toggling visibility:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle visibility'
    });
  }
});

export default router;
