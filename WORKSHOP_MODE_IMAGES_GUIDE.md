# Workshop Mode Images - Customization Guide

## Overview
All workshop mode images are stored in `/public/workshop-modes/` as SVG files. You can easily customize them by replacing the SVG files with your own PNG, JPG, or keeping them as SVG.

## Current Images

### 1. **ONLINE** (`online.svg`)
- **Color:** Blue (#0066CC)
- **Background:** Light blue (#E8F5FF)
- **Icon:** Computer monitor with online waves
- **Edit:** Replace with a video conference icon, Zoom logo, or online meeting theme

### 2. **OFFLINE** (`offline.svg`)
- **Color:** Orange (#FF8C00)
- **Background:** Light orange (#FFF4E8)
- **Icon:** Building with windows and door
- **Edit:** Replace with a location pin, physical building, or studio icon

### 3. **RESIDENTIAL** (`residential.svg`)
- **Color:** Green (#22C55E)
- **Background:** Light green (#E8F5E9)
- **Icon:** Multi-story building/hotel
- **Edit:** Replace with accommodation icon, bed symbol, or resort theme

### 4. **RECORDED** (`recorded.svg`)
- **Color:** Purple (#9C27B0)
- **Background:** Light purple (#F3E5F5)
- **Icon:** Film reel with play button
- **Edit:** Replace with video icon, play button, or video library theme

## How to Customize

### Option 1: Replace SVG Files (Keep Current Format)
1. Edit the `.svg` files in `/public/workshop-modes/` directly
2. Modify colors, shapes, or text within the SVG
3. Save and refresh browser

### Option 2: Use PNG Images (Recommended for Custom Designs)
1. Design your custom PNG images (200x200px recommended)
2. Delete the SVG files
3. Upload PNG files to `/public/workshop-modes/`:
   - `online.png`
   - `offline.png`
   - `residential.png`
   - `recorded.png`
4. Update `/src/utils/workshopModes.ts` paths:
   ```typescript
   icon: '/workshop-modes/online.png'  // Change from .svg to .png
   ```

### Option 3: Use External URLs
1. Update `/src/utils/workshopModes.ts` with external URLs:
   ```typescript
   icon: 'https://example.com/online-icon.png'
   ```

## Configuration File

**Location:** `/src/utils/workshopModes.ts`

Edit this file to customize:
- Icon paths
- Colors (hex codes)
- Background colors
- Label text
- Description text

```typescript
export const WORKSHOP_MODES: Record<string, WorkshopModeConfig> = {
  online: {
    icon: '/workshop-modes/online.svg',  // ← Change path here
    color: '#0066CC',                     // ← Change icon color
    bgColor: '#E8F5FF',                   // ← Change background
    textColor: '#0066CC',
    label: 'Online',                      // ← Change label
    description: 'Live interactive sessions via video conference',  // ← Change description
  },
  // ... similar for other modes
};
```

## Where Images Are Used

### 1. **Workshop List Page** (`/src/pages/WorkshopListPage.tsx`)
- **Location:** Bottom-left corner of workshop thumbnail
- **Size:** 40x40px (small circular badges)
- **Purpose:** Shows available modes for each workshop

### 2. **Workshop Detail Page** (`/src/pages/WorkshopDetailPage.tsx`)
- **Location 1:** Mode selection buttons (2x2 grid)
  - **Size:** 40x40px badges
  - **Purpose:** Click to select delivery mode
  
- **Location 2:** Selected batch info box
  - **Size:** 64x64px large badge
  - **Purpose:** Displays selected mode visually

## Component Usage

### WorkshopModeBadge Component
**File:** `/src/components/WorkshopModeBadge.tsx`

Usage in your components:
```tsx
import WorkshopModeBadge from '../components/WorkshopModeBadge';

// Small badge (40x40px)
<WorkshopModeBadge mode="online" size="sm" showLabel={false} />

// Medium badge (48x48px)
<WorkshopModeBadge mode="offline" size="md" showLabel={true} />

// Large badge (64x64px)
<WorkshopModeBadge mode="residential" size="lg" showLabel={true} showDescription={true} />
```

Props:
- `mode`: 'online' | 'offline' | 'residential' | 'recorded'
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `showLabel`: boolean (default: true)
- `showDescription`: boolean (default: false)

## Color Scheme

### Online (Blue)
- **Icon Color:** #0066CC
- **Background:** #E8F5FF
- **Use:** Video conferences, Zoom, Teams

### Offline (Orange)
- **Icon Color:** #FF8C00
- **Background:** #FFF4E8
- **Use:** Physical location, studio, classroom

### Residential (Green)
- **Icon Color:** #22C55E
- **Background:** #E8F5E9
- **Use:** Accommodation, retreat, immersive

### Recorded (Purple)
- **Icon Color:** #9C27B0
- **Background:** #F3E5F5
- **Use:** Video library, on-demand, self-paced

## Design Tips

1. **Keep Aspect Ratio:** Maintain square (1:1) format for consistency
2. **Padding:** Leave 10-15% padding around icon
3. **Color Contrast:** Ensure text is readable on background
4. **Simplicity:** Avoid complex designs - icons should be recognizable at small sizes
5. **Consistency:** Use similar design language across all 4 modes

## Examples of Custom Icons

### Online
- Video camera icon
- Computer/laptop with video waves
- Zoom/Teams logo
- WiFi symbol

### Offline
- Location pin
- Building silhouette
- Classroom/studio icon
- Map marker

### Residential
- Bed icon
- House/hotel
- Mountain retreat
- Accommodation symbol

### Recorded
- Play button
- Film reel
- Video player
- Tape symbol

## Testing Locally

After making changes:
1. Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Check images appear on:
   - Workshop list page thumbnails
   - Workshop detail page batch selector
   - Workshop detail page selected batch info box
3. Test hover effects and interactions

## Deployment

After customizing images:
1. Commit changes: `git add . && git commit -m "Update workshop mode images"`
2. Push to GitHub: `git push origin main`
3. Vercel auto-deploys - images appear live in ~1-2 minutes

## Support

- **SVG Editors:** Adobe Illustrator, Figma, Inkscape, Draw.io
- **PNG Editors:** Photoshop, GIMP, Canva, Pixlr
- **Recommended Size:** 200x200px for source, automatically scales down
