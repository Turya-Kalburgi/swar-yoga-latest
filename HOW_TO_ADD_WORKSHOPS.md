# How to Add Workshops

The workshop system has been simplified. Now you can **add workshops directly in the code**.

## Steps to Add a Workshop:

1. Open: `src/pages/workshopPage.tsx`

2. Find this section:
```typescript
const LOCAL_WORKSHOPS: Workshop[] = [
  {
    id: '1',
    title: 'Beginner Swar Yoga',
    // ... workshop details
  },
  // ADD MORE WORKSHOPS HERE
];
```

3. Add your workshop like this:
```typescript
{
  id: '2',
  title: 'Advanced Swar Yoga',
  instructor: 'Yogacharya Mohan Kalburgi',
  startDate: '2025-12-25',
  endDate: '2025-12-30',
  duration: '6 days',
  startTime: '09:00',
  endTime: '17:00',
  priceINR: 7000,
  priceNPR: 10000,
  priceUSD: 100,
  maxParticipants: 40,
  category: 'Advanced',
  mode: 'Online',
  language: 'Hindi',
  level: 'Advanced',
  location: 'Online',
  image: '/logo with mohan sir.png',
  youtubeId: 'VIDEO_ID_HERE',
  description: 'Advanced breathing techniques and meditation'
}
```

4. **Save the file**

5. **Run the dev server:**
   ```bash
   npm run dev
   ```

6. **Build and deploy:**
   ```bash
   npm run build
   git add -A
   git commit -m "Add: New workshops"
   git push
   ```

## Workshop Fields:

- `id`: Unique identifier (use incremental numbers)
- `title`: Workshop name
- `instructor`: Instructor name
- `startDate`: YYYY-MM-DD format
- `endDate`: YYYY-MM-DD format
- `duration`: "X days" or "X weeks"
- `startTime`: HH:MM (24-hour format)
- `endTime`: HH:MM (24-hour format)
- `priceINR`: Price in Indian Rupees
- `priceNPR`: Price in Nepalese Rupees
- `priceUSD`: Price in US Dollars
- `maxParticipants`: Maximum participants allowed
- `category`: Type of workshop (Beginner, Advanced, etc.)
- `mode`: Online or Offline
- `language`: Hindi, English, etc.
- `level`: Beginner, Intermediate, Advanced
- `location`: City or "Online"
- `image`: Image URL
- `youtubeId`: YouTube video ID (optional)
- `description`: Brief description

That's it! No database required, no API needed. Just add workshops directly in the code.
