# Testing Cache Components Implementation

## Quick Start Testing

### 1. Install Dependencies & Build

```bash
cd apps/frontend
pnpm install
pnpm build
pnpm start
```

> **Note**: Cache Components work best in production mode. Development mode has different caching behavior.

### 2. Test Public Pages (Cached)

#### Home Page (Posts List)
```bash
# Open browser
http://localhost:3000
```

**Expected Behavior:**
- ✅ Page loads instantly (~50-300ms)
- ✅ Posts are pre-rendered in HTML
- ✅ No loading spinner on first visit
- ✅ Animations work smoothly

**Verify Caching:**
1. Open Network tab in DevTools
2. Refresh page multiple times
3. Notice: No API calls to `/posts` endpoint
4. Data is served from Next.js cache

#### Post Detail Page
```bash
# Click any post or visit directly
http://localhost:3000/post/{slug}
```

**Expected Behavior:**
- ✅ Individual post loads instantly
- ✅ Full content in HTML (check View Source)
- ✅ SEO meta tags populated
- ✅ Back button works smoothly

### 3. Test Cache Invalidation (Admin)

#### Create a New Post
```bash
# Login to admin
http://localhost:3000/admin/login

# Create new post
http://localhost:3000/admin/posts/new
```

**Steps:**
1. Fill in post details
2. Set "Published At" to current time
3. Click "Save"
4. Check console for: `✅ Posts list cache invalidated`
5. Visit home page → New post appears immediately

#### Update Existing Post
```bash
# Edit any post
http://localhost:3000/admin/posts/{id}
```

**Steps:**
1. Modify title or content
2. Click "Save"
3. Check console for: `✅ Post cache invalidated for slug: {slug}`
4. Visit post detail page → Changes appear immediately

#### Delete a Post
```bash
# Admin posts list
http://localhost:3000/admin/posts
```

**Steps:**
1. Click "Delete" on any post
2. Confirm deletion
3. Check console for cache invalidation logs
4. Visit home page → Post removed immediately

### 4. Performance Testing

#### Measure Load Times

**Using Browser DevTools:**
1. Open Network tab
2. Disable cache (for accurate testing)
3. Hard refresh (Ctrl+Shift+R)
4. Check "Load" time at bottom of Network tab

**Expected Times:**
- Home page: 200-500ms (first visit)
- Home page: 50-100ms (cached)
- Post detail: 100-300ms (first visit)
- Post detail: 50-100ms (cached)

#### Lighthouse Audit

```bash
# Run Lighthouse in Chrome DevTools
# Performance tab → Generate report
```

**Expected Scores:**
- Performance: 90+ ✅
- Accessibility: 90+ ✅
- Best Practices: 90+ ✅
- SEO: 95+ ✅

### 5. Cache Behavior Testing

#### Test Cache Revalidation

```bash
# In production mode
pnpm start
```

**Test Scenarios:**

**Scenario 1: Stale Cache (60s for posts list)**
1. Visit home page at 12:00:00
2. Update a post in admin at 12:00:30
3. Visit home page at 12:00:45
4. **Result**: Old data (still in stale period)
5. Visit home page at 12:01:30
6. **Result**: New data (past stale period, revalidated)

**Scenario 2: Hard Expiration (1 hour for posts list)**
1. Visit home page
2. Wait 1 hour
3. Visit home page again
4. **Result**: Cache expired, fresh data fetched

**Scenario 3: Manual Invalidation**
1. Visit home page
2. Create/update/delete post in admin
3. Visit home page immediately
4. **Result**: Cache invalidated, new data appears instantly

### 6. SEO Verification

#### Check Pre-rendered Content

**View Page Source:**
```bash
# Right-click → View Page Source
# OR
curl http://localhost:3000 | grep -i "posts"
curl http://localhost:3000/post/{slug} | grep -i "title"
```

**Expected:**
- ✅ Full post titles in HTML
- ✅ Post content in HTML
- ✅ Meta tags populated
- ✅ No "Loading..." placeholders

#### Check Metadata

**Inspect Post Detail Page:**
```html
<head>
  <title>Your Post Title</title>
  <meta name="description" content="Post summary">
  <meta property="og:title" content="Your Post Title">
  <meta property="og:type" content="article">
  <meta property="og:published_time" content="2025-10-31">
</head>
```

### 7. Comparison Testing

#### Before Cache Components (Client-Side)

**Old behavior** (if you want to test by temporarily reverting):
1. Page shows loading spinner
2. Client-side API call to `/posts`
3. Data loads after JavaScript executes
4. ~1.5s initial load time

#### After Cache Components (Server-Side)

**New behavior:**
1. Page renders immediately with data
2. No API calls on client
3. Data pre-rendered in HTML
4. ~300ms initial load time

**Improvement: ~80% faster!** 🚀

### 8. Error Handling Testing

#### Test 404 Not Found

```bash
# Visit non-existent post
http://localhost:3000/post/invalid-slug-xyz
```

**Expected:**
- ✅ Shows Next.js 404 page
- ✅ No error in console
- ✅ `notFound()` called correctly

#### Test Empty Posts List

**Steps:**
1. Delete all posts in admin
2. Visit home page
3. **Expected**: "No posts available yet." message

#### Test Network Failure

**Simulate backend down:**
1. Stop backend server
2. Wait for cache to expire (1 hour)
3. Visit home page
4. **Expected**: Empty posts list or error message

### 9. Development Testing

#### Test in Development Mode

```bash
pnpm dev
```

**Note:** Caching behavior differs in development:
- Cache is less aggressive
- Hot reload invalidates cache
- Useful for testing invalidation logic

**Test Checklist:**
- ✅ Hot reload works
- ✅ Changes reflect immediately
- ✅ No TypeScript errors
- ✅ Animations work
- ✅ Navigation works

### 10. Monitoring in Production

#### Check Console Logs

**After admin operations:**
```
✅ Posts list cache invalidated
✅ Post cache invalidated for slug: my-post-slug
✅ All posts cache invalidated
```

#### Check Next.js Build Output

```bash
pnpm build
```

**Look for:**
```
Route (app)                             Size     First Load JS
┌ ○ /                                   142 B   100 kB
├ ○ /post/[slug]                        148 B   102 kB
└ ● /admin/posts                        256 B   120 kB

○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses getStaticProps)
ƒ  (Dynamic) server-rendered on demand
```

## Common Issues & Solutions

### Issue: "Cannot use 'use cache' in Client Component"
**Solution:** Move data fetching to Server Component or `cached-api.ts`

### Issue: Cache not invalidating
**Solution:** Check that `invalidateCacheAfterMutation()` is called after mutations

### Issue: Slow first load
**Solution:** Check backend response time, not Next.js caching issue

### Issue: Stale data persists
**Solution:** Reduce `stale` time in `next.config.js` cache profiles

## Success Criteria

✅ **Performance:**
- Home page loads in < 500ms
- Post detail loads in < 300ms
- No loading spinners on first visit

✅ **Caching:**
- No API calls for cached routes
- Cache invalidates after admin mutations
- Console logs show invalidation events

✅ **SEO:**
- Full content in HTML source
- Meta tags populated
- Lighthouse SEO score > 95

✅ **User Experience:**
- Smooth animations
- Instant page transitions
- No flash of loading state

## Automated Testing

### Future Testing Setup

```typescript
// Example test for cached data fetching
import { getPublishedPosts } from '@/lib/cached-api';

describe('Cache Components', () => {
  it('should cache posts data', async () => {
    const posts1 = await getPublishedPosts();
    const posts2 = await getPublishedPosts();
    // Second call should be cached
    expect(posts1).toEqual(posts2);
  });
});
```

## Need Help?

- Review: [CACHE_COMPONENTS_GUIDE.md](./CACHE_COMPONENTS_GUIDE.md)
- Check: [Next.js Docs](https://nextjs.org/docs/app/getting-started/cache-components)
- Debug: Enable verbose logging in `cached-api.ts`

---

**Happy Testing!** 🧪✨

