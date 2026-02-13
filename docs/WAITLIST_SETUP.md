# Waitlist Setup — Collect Play Store Testers

The nomadcrew.uk waitlist now stores signups in Supabase so you can export emails for Play Console testers.

---

## 1. Create the Supabase table

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/kijatqtrwdzltelqzadx)
2. **SQL Editor** → New query
3. Paste and run:

```sql
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert for waitlist" ON waitlist_signups;
CREATE POLICY "Allow anonymous insert for waitlist" ON waitlist_signups
  FOR INSERT TO anon WITH CHECK (true);
```

---

## 2. Add env vars to Cloudflare Pages

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **nomadcrew-landing-page**
2. **Settings** → **Environment variables**
3. Add for **Production** (and Preview if you use it):

| Variable | Value | Encrypt? |
|----------|-------|----------|
| `SUPABASE_URL` | `https://kijatqtrwdzltelqzadx.supabase.co` | No |
| `SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |

**Where to get anon key:** Supabase Dashboard → **Settings** → **API** → Project API keys → `anon` `public`

4. **Redeploy** the Pages project so the new env vars apply.

---

## 3. Share the waitlist link

Send to your contacts:

**https://nomadcrew.uk/#waitlist**

(Or https://nomadcrew.uk — the "Join Waitlist" button scrolls to the form.)

---

## 4. Export emails for Play Console

1. Supabase Dashboard → **Table Editor** → **waitlist_signups**
2. Click **...** (menu) → **Export to CSV**
3. Copy the email column into Play Console:
   - **Test and release** → **Testing** → **Closed testing** → **Testers** tab
   - **Create email list** → Paste emails (one per line or comma-separated)

You need **at least 12 testers** for 14 days (personal account requirement).

---

## How it works

- User signs up on nomadcrew.uk waitlist
- Confirmation email sent via Resend (unchanged)
- Email stored in Supabase `waitlist_signups`
- Duplicate signups are ignored (unique constraint)
- Export from Supabase when ready for Closed testing
