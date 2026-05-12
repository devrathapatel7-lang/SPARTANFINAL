# Spartan Roofing — Deployment Guide

Plain-English step-by-step. Read top to bottom the first time.

---

## 1. Test the site locally first

Before you put it on the internet, make sure it works on your computer.

1. Open Finder and navigate to `~/Downloads/spartan-html/`
2. Double-click `index.html`
3. The site opens in your default browser. Click around, scroll, try the form, open it on your phone (drag the browser window narrow to simulate mobile).

If anything looks broken, fix it before deploying.

---

## 2. One-time form setup (REQUIRED before going live)

The contact form sends submissions to **dev@seaagency.co** through a free service called FormSubmit. Before any submissions actually go through, FormSubmit needs to verify the email address one time:

1. Once the site is live (after Step 4 below), go to the live website on a real URL.
2. Fill out the contact form with any test data and click "Request My Free Inspection."
3. Open the inbox at **dev@seaagency.co**. There will be a confirmation email from FormSubmit.
4. Click the **"Confirm your email"** button in that email.
5. From now on, every form submission goes straight to dev@seaagency.co with no further action.

**Important**: The form will NOT work from a `file://` URL on your computer — only from a real `https://` URL. So you can't test the form locally; test it after deployment.

---

## 3. Pick a hosting provider (Vercel recommended — free)

You have three good options. **Vercel is the simplest.**

### Option A: Vercel (recommended — easiest)
- Free for small business sites
- Drag-and-drop deploy
- Automatic HTTPS
- Free custom domain support

### Option B: Netlify
- Same idea as Vercel, also free
- Drag-and-drop deploy

### Option C: Cloudflare Pages
- Free, also great
- Slightly more technical setup

I'll walk through **Vercel** below. Netlify works almost identically.

---

## 4. Deploy to Vercel (5 minutes)

1. Go to **https://vercel.com** and click **Sign Up**. Use your email or GitHub account. Free.

2. After signing in, you'll land on the dashboard. Click **"Add New..."** → **"Project"** in the top right.

3. You'll see two options. Look for **"Browse all templates →"** at the bottom or — easier — scroll down to find **"Or, deploy a folder by drag-and-drop"** (sometimes labeled "Deploy from local folder"). 

   **Easiest path:** install the Vercel command-line tool. Open Terminal (Cmd+Space, type "Terminal") and run these one at a time:
   ```
   npm install -g vercel
   cd ~/Downloads/spartan-html
   vercel
   ```
   If you don't have Node installed, first run:
   ```
   brew install node
   ```
   (And if `brew` isn't installed: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`)

4. The `vercel` command will ask a few questions. Press Return to accept defaults for each:
   - "Set up and deploy?" → **Y**
   - "Which scope?" → your account
   - "Link to existing project?" → **N**
   - "Project name?" → press Return (or type `spartan-roofing`)
   - "In which directory is your code?" → press Return (just `./`)
   - "Want to modify settings?" → **N**

5. Wait 30–60 seconds. Vercel gives you a URL like `https://spartan-roofing-xyz.vercel.app`. **The site is live.**

6. To deploy the **production** version (the URL your client uses):
   ```
   vercel --prod
   ```

That's it — your site is live on the internet. Now connect the real domain.

---

## 5. Connect your client's domain

Let's say the client's domain is `spartanroofingnj.com`.

### Step 5a: Add the domain in Vercel

1. Go to **https://vercel.com/dashboard** → click your project → **Settings** (top tab) → **Domains** (left sidebar).
2. Type `spartanroofingnj.com` and click **Add**.
3. Vercel will also offer to add `www.spartanroofingnj.com` — say yes.
4. Vercel shows you DNS records to add. **Keep this tab open** — you'll copy these in the next step.

### Step 5b: Update DNS at the registrar

Now log into wherever your client bought the domain (GoDaddy, Namecheap, Google Domains, Squarespace, etc.). Find the **DNS settings** page for that domain.

You'll need to add (or change) two records that Vercel showed you:

| Type | Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

(Your exact Vercel values may differ — copy what Vercel shows you, not what's in this table.)

**For each registrar:**
- **GoDaddy**: My Products → DNS → manage your records, add the A record and CNAME above
- **Namecheap**: Domain List → Manage → Advanced DNS, then add the records
- **Google Domains / Squarespace Domains**: DNS → Custom records → add both
- **Cloudflare**: DNS → Records → add A and CNAME (set Proxy status to **DNS only / grey cloud** when first connecting)

Save the changes.

### Step 5c: Wait

DNS changes can take **5 minutes to a few hours** to propagate. You can check status at https://dnschecker.org by typing in `spartanroofingnj.com`.

In Vercel's Domains page, you'll see a green checkmark when DNS is connected. HTTPS is automatic — Vercel handles the SSL certificate for you.

**You're live with the client's domain.**

---

## 6. Confirm the form works

After the domain is connected:
1. Go to `https://spartanroofingnj.com` (or the real domain).
2. Fill out the contact form with any data.
3. Click submit.
4. **First time only:** check `dev@seaagency.co` inbox for a FormSubmit verification email and click the confirm link inside.
5. After that, every submission goes straight through to `dev@seaagency.co`.

---

## 7. Making changes in the future

Two paths.

### Easy path — drag and re-deploy
1. Edit your HTML files in VS Code (free at https://code.visualstudio.com).
2. When ready to push the changes live, in Terminal:
   ```
   cd ~/Downloads/spartan-html
   vercel --prod
   ```
3. The live site updates in 30–60 seconds.

### Even easier — connect to GitHub
1. Make a free GitHub account at https://github.com
2. Install GitHub Desktop (https://desktop.github.com)
3. In GitHub Desktop: File → Add Local Repository → pick `~/Downloads/spartan-html`. Publish.
4. In Vercel → your project → Settings → Git → connect to your GitHub repo.
5. From now on, save your edits, click "Commit & Push" in GitHub Desktop, and Vercel auto-publishes within a minute.

---

## 8. Common edits — where to find things

Open these files in VS Code:

| What you want to change | File | What to search for (Cmd+F) |
|---|---|---|
| Phone number | `index.html` + all service pages | `973-938-2776` |
| Email address | `index.html` | `info@spartanroofingnj.com` |
| Office address | `index.html` | `220 Davidson Ave` |
| Counties served | `index.html` | `county-list` |
| License number | `index.html` | `13VH123456` |
| Customer reviews | `script.js` | `const TESTIMONIALS` |
| Review count | `index.html` | `139 Google Reviews` |
| Service descriptions | `services/*.html` | each service has its own file |
| FAQs | `index.html` | search for `<div class="faq-item">` |
| Form recipient email | `index.html` + `script.js` | `dev@seaagency.co` |
| Logo | `images/logo.png` (replace the file) | n/a |
| Photos | `images/photo-NN.jpg` (replace files) | n/a |
| Instagram link | `index.html` | `instagram.com/spartan_roofing_nj` |

---

## 9. Pre-launch checklist

Before sharing the site with the client / public:

- [ ] Replaced placeholder NJ License `#13VH123456` with the real license number
- [ ] Replaced EPA Lead-Safe number placeholder with real one
- [ ] Confirmed office address is correct (currently `220 Davidson Ave, Somerset, NJ 08873`)
- [ ] Confirmed phone number `973-938-2776` is correct
- [ ] Tested the contact form once (confirmed FormSubmit verification email)
- [ ] Read the Privacy Policy / Terms / Accessibility pages and confirmed with client
- [ ] Tested the site on an actual phone, not just a small browser window
- [ ] Tested all service-card links (8 services, all should open detail pages)
- [ ] Confirmed Instagram and (if added) Facebook links go to real accounts

---

## 10. If something breaks

| Problem | Fix |
|---|---|
| Form doesn't send | Did you verify the FormSubmit confirmation email? See Step 2. |
| Site shows 404 on a service page | Make sure the `services/` folder uploaded with all 8 HTML files |
| Photos broken | Make sure the `images/` folder uploaded with all photo files |
| Domain not working after 24h | Use https://dnschecker.org to check DNS propagation; verify the A record matches what Vercel showed |
| HTTPS warning in browser | Wait 30 minutes; Vercel issues SSL automatically but it can take a few minutes after DNS connects |
| Site looks weird on phone | Hard-refresh the browser (Shift+Reload) — the CSS may be cached |

---

## Quick reference

- **Live URL** (after you deploy): `https://spartanroofingnj.com`
- **Vercel dashboard**: https://vercel.com/dashboard
- **Form submissions go to**: `dev@seaagency.co`
- **Source code**: `~/Downloads/spartan-html/`
- **DNS check tool**: https://dnschecker.org
