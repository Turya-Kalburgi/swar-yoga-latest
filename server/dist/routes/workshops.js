import express from 'express';
import Workshop from '../models/Workshop.js';
const router = express.Router();
function getUserIdFromHeaders(req) {
    return req.headers['x-user-id'] || 'anonymous';
}
router.get('/', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.isPublic !== undefined) {
            filter.isPublic = req.query.isPublic === 'true';
        }
        else {
            filter.isPublic = true;
        }
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
            ];
        }
        console.log('📖 Fetching workshops with filter:', filter);
        const [workshops, total] = await Promise.all([
            Workshop.find(filter).skip(skip).limit(limit).lean().sort({ startDate: -1 }),
            Workshop.countDocuments(filter),
        ]);
        console.log(`✅ Retrieved ${workshops.length} workshops from MongoDB`);
        res.json({
            success: true,
            data: workshops,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error fetching workshops:', errorMessage);
        res.status(500).json({ success: false, message: 'Failed to fetch workshops', error: errorMessage });
    }
});
router.get('/stats/summary', async (req, res) => {
    try {
        console.log('📊 Fetching workshop statistics');
        const [total, public_count, upcoming, enrolled_sum] = await Promise.all([
            Workshop.countDocuments(),
            Workshop.countDocuments({ isPublic: true }),
            Workshop.countDocuments({ startDate: { $gte: new Date() } }),
            Workshop.aggregate([{ $group: { _id: null, totalEnrolled: { $sum: '$enrolledCount' } } }]),
        ]);
        res.json({
            success: true,
            data: {
                total,
                public: public_count,
                upcoming,
                totalEnrolled: enrolled_sum[0]?.totalEnrolled || 0,
            },
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error fetching statistics:', errorMessage);
        res.status(500).json({ success: false, error: errorMessage });
    }
});
router.get('/:id', async (req, res) => {
    try {
        console.log(`📖 Fetching workshop with ID: ${req.params.id}`);
        const workshop = await Workshop.findById(req.params.id);
        if (!workshop) {
            res.status(404).json({ success: false, message: 'Workshop not found' });
            return;
        }
        console.log(`✅ Retrieved workshop: ${workshop.title}`);
        res.json({ success: true, data: workshop });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error fetching workshop:', errorMessage);
        res.status(500).json({ success: false, message: 'Failed to fetch workshop', error: errorMessage });
    }
});
router.post('/', async (req, res) => {
    try {
        const userId = getUserIdFromHeaders(req);
        console.log(`✍️ Creating workshop by user: ${userId}`);
        if (!req.body.title || !req.body.instructor) {
            res.status(400).json({ success: false, message: 'Title and instructor are required' });
            return;
        }
        const workshop = new Workshop({ ...req.body, enrolledCount: 0 });
        const savedWorkshop = await workshop.save();
        console.log(`✅ Workshop created in MongoDB: ${savedWorkshop._id}`);
        res.status(201).json({ success: true, data: savedWorkshop, message: 'Workshop created successfully' });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error creating workshop:', errorMessage);
        res.status(500).json({ success: false, message: 'Failed to create workshop', error: errorMessage });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const userId = getUserIdFromHeaders(req);
        console.log(`🔄 Updating workshop ${req.params.id} by user: ${userId}`);
        const workshop = await Workshop.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true, runValidators: true });
        if (!workshop) {
            res.status(404).json({ success: false, message: 'Workshop not found' });
            return;
        }
        console.log(`✅ Workshop updated: ${workshop.title}`);
        res.json({ success: true, data: workshop, message: 'Workshop updated successfully' });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error updating workshop:', errorMessage);
        res.status(500).json({ success: false, message: 'Failed to update workshop', error: errorMessage });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const userId = getUserIdFromHeaders(req);
        console.log(`🗑️ Deleting workshop ${req.params.id} by user: ${userId}`);
        const workshop = await Workshop.findByIdAndDelete(req.params.id);
        if (!workshop) {
            res.status(404).json({ success: false, message: 'Workshop not found' });
            return;
        }
        console.log(`✅ Workshop deleted: ${workshop.title}`);
        res.json({ success: true, message: 'Workshop deleted successfully', deletedId: req.params.id });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error deleting workshop:', errorMessage);
        res.status(500).json({ success: false, message: 'Failed to delete workshop', error: errorMessage });
    }
});
router.post('/:id/enroll', async (req, res) => {
    try {
        const userId = getUserIdFromHeaders(req);
        console.log(`📝 User ${userId} enrolling in workshop ${req.params.id}`);
        const workshop = await Workshop.findById(req.params.id);
        if (!workshop) {
            res.status(404).json({ success: false, message: 'Workshop not found' });
            return;
        }
        const currentEnrolled = workshop.enrolledCount || 0;
        if (currentEnrolled >= (workshop.maxParticipants || 100)) {
            res.status(400).json({ success: false, message: 'Workshop is full' });
            return;
        }
        workshop.enrolledCount = currentEnrolled + 1;
        await workshop.save();
        console.log(`✅ User enrolled. New count: ${workshop.enrolledCount}`);
        res.json({ success: true, data: workshop, message: 'Enrolled successfully' });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error enrolling in workshop:', errorMessage);
        res.status(500).json({ success: false, message: 'Failed to enroll', error: errorMessage });
    }
});
export default router;
//# sourceMappingURL=workshops.js.map