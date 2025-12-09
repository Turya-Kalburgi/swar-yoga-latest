# Custom Domain Setup: swaryoga.com

## Step 1: Add Domain to Vercel
1. Go to: https://vercel.com/dashboard
2. Select: swar-yoga-latest project
3. Go to: Settings → Domains
4. Click: Add Domain
5. Enter: swaryoga.com
6. Click: Add

## Step 2: Update DNS Records
Go to your domain registrar (GoDaddy, Namecheap, etc.) and add these records:

### Option A: Using CNAME (Easiest)
```
Name: www
Type: CNAME
Value: cname.vercel-dns.com
TTL: 3600
```

### Option B: Using A Records
```
Type: A
Name: @
Value: 76.76.19.165
TTL: 3600
```

```
Type: A
Name: www
Value: 76.76.19.165
TTL: 3600
```

## Step 3: Verify in Vercel
1. After DNS updates (can take 15-30 minutes)
2. Vercel auto-verifies the domain
3. Your site will be live at: https://swaryoga.com

## Current Status
- Production URL: https://swar-yoga-dec1.vercel.app/
- Custom Domain: swaryoga.com (pending DNS setup)

## Next Steps
1. Add DNS records at your domain registrar
2. Wait for DNS propagation (15-30 minutes)
3. Vercel auto-detects and enables HTTPS
4. Your site goes live at swaryoga.com!
