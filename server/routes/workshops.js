import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * Get the workshops JSON file path
 * Resolves to /project-root/server-data.json
 */
function getWorkshopsFilePath() {
  // Decode URI component to handle spaces in paths (e.g., 'project 13')
  const serverDir = decodeURIComponent(new URL('.', import.meta.url).pathname);
  return path.resolve(serverDir, '../../server-data.json');
}

/**
 * Read all workshops from file
 */
async function readWorkshops() {
  try {
    const filePath = getWorkshopsFilePath();
    console.log('Reading workshops from:', filePath);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      console.log('File does not exist, creating default data...');
      const defaultData = {
        workshops: [
          {
            id: '1733417400000',
            title: 'TEST WORKSHOP - Data Persistence Test',
            instructor: 'Test Admin',
            startDate: '2025-12-10',
            endDate: '2025-12-15',
            duration: '5 Days',
            startTime: '09:00',
            endTime: '17:00',
            priceINR: 999,
            priceNPR: 1600,
            priceUSD: 12,
            maxParticipants: 20,
            category: 'Test Category',
            mode: 'Online',
            language: 'English',
            level: 'All Levels',
            location: 'Test Location',
            image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
            youtubeId: 'test',
            paymentLinkINR: 'https://example.com/pay',
            paymentLinkNPR: 'https://example.com/pay',
            paymentLinkUSD: 'https://example.com/pay',
            whatsappGroupLink: 'https://chat.whatsapp.com/test',
            prerequisites: 'None',
            learningOutcomes: 'Test learning outcomes',
            includedItems: 'Test materials',
            remarks: 'This is a test workshop to verify data persistence',
            isPublic: true,
            enrolledCount: 0,
            rating: 4.5,
            created_at: '2025-12-05T12:30:00.000Z',
            updated_at: '2025-12-05T12:30:00.000Z'
          }
        ]
      };
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      console.log('Default data created at:', filePath);
    }
    
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    console.log('Successfully read', data.workshops?.length || 0, 'workshops');
    return data.workshops || [];
  } catch (error) {
    console.error('Error reading workshops file:', error.message);
    console.error('Stack:', error.stack);
    return [];
  }
}

/**
 * Write workshops to file
 */
async function writeWorkshops(workshops) {
  try {
    const filePath = getWorkshopsFilePath();
    const data = { workshops };
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
router.get('/', async (req, res) => {
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
router.get('/public', async (req, res) => {
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
router.post('/', async (req, res) => {
  try {
    const batch = req.body;

    // Validate required fields
    if (!batch.title || !batch.instructor || !batch.startDate || !batch.endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, instructor, startDate, endDate'
      });
    }

    // Create new workshop with ID
    const newWorkshop = {
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
router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

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
router.delete('/:id', async (req, res) => {
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
router.patch('/:id/visibility', async (req, res) => {
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
