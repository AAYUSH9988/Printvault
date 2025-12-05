# 🚀 Printvault Deployment Guide

This guide will help you deploy the Printvault application:
- **Frontend**: Vercel (Next.js)
- **Backend**: Render (Node.js/Express)
- **Database**: MongoDB Atlas (already configured)

---

## 📋 Pre-Deployment Checklist

- [x] Frontend Next.js app is working locally
- [x] Backend Express API is working locally
- [x] MongoDB Atlas database is connected
- [x] Admin authentication is working
- [x] All CRUD operations are functional

---

## 🔧 Step 1: Deploy Backend to Render

### 1.1 Push Backend to GitHub

Make sure your backend code is pushed to a GitHub repository.

```bash
cd printvault/backend
git init  # if not already initialized
git add .
git commit -m "Prepare backend for deployment"
git push origin main
```

### 1.2 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

### 1.3 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the `printvault/backend` folder (or the backend repo)

### 1.4 Configure Service Settings

| Setting | Value |
|---------|-------|
| **Name** | `printvault-api` |
| **Region** | Singapore (closest to India) |
| **Branch** | `main` |
| **Root Directory** | `backend` (if monorepo) or leave empty |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### 1.5 Add Environment Variables

In Render Dashboard → Your Service → **Environment**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `MONGODB_URI` | `mongodb+srv://aayushvaghela12_db_user:CxNdI21I22mHHea0@printvault-resources.poqshpd.mongodb.net/printvault?retryWrites=true&w=majority&appName=Printvault-resources` |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` (update after frontend deploy) |
| `ADMIN_PASSWORD` | `JalaramCards@2025` |
| `JWT_SECRET` | `printvault_jwt_secret_key_2025_production` |

### 1.6 Deploy

Click **"Create Web Service"**. Wait for the build to complete.

Your backend URL will be: `https://printvault-api.onrender.com`

> ⚠️ **Note**: Free tier on Render spins down after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Push Frontend to GitHub

```bash
cd printvault/frontend
git init  # if not already initialized
git add .
git commit -m "Prepare frontend for deployment"
git push origin main
```

### 2.2 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### 2.3 Import Project

1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. If monorepo, set Root Directory to `frontend`

### 2.4 Configure Project Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `frontend` (if monorepo) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

### 2.5 Add Environment Variables

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://printvault-api.onrender.com` |
| `NEXT_PUBLIC_SITE_NAME` | `Printvault` |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | `Free print resources library by Jalaram Cards` |

### 2.6 Deploy

Click **"Deploy"**. Wait for the build to complete.

Your frontend URL will be: `https://printvault.vercel.app` (or similar)

---

## 🔄 Step 3: Update CORS Settings

After both are deployed:

1. Go to **Render Dashboard** → Your Backend Service → **Environment**
2. Update `CORS_ORIGIN` to your Vercel URL (e.g., `https://printvault.vercel.app`)
3. Click **"Save Changes"** (this will trigger a redeploy)

---

## ✅ Step 4: Verify Deployment

### Test Backend Health
```
https://printvault-api.onrender.com/health
```

Should return:
```json
{
  "success": true,
  "message": "Printvault API is running",
  "timestamp": "..."
}
```

### Test Frontend
1. Visit your Vercel URL
2. Check that resources load correctly
3. Test admin login at `/admin/login`
4. Verify CRUD operations work

---

## 🔧 Troubleshooting

### Backend Issues

**"Application error" on Render:**
- Check Render logs for errors
- Verify environment variables are set correctly
- Ensure build command is correct

**CORS errors:**
- Update `CORS_ORIGIN` in Render to match your Vercel URL exactly
- Don't include trailing slash

**Database connection issues:**
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all)
- Check MONGODB_URI is correct

### Frontend Issues

**API calls failing:**
- Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Ensure backend is running (check health endpoint)
- Check browser console for errors

**Build failures:**
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Fix any TypeScript errors

---

## 📱 Custom Domain (Optional)

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

### Render (Backend)
1. Go to Service Settings → Custom Domains
2. Add your API subdomain (e.g., `api.yourdomain.com`)
3. Configure DNS as instructed

---

## 🔐 Security Recommendations

1. **Change default admin password** in production
2. **Use strong JWT secret** (generate a random 64-char string)
3. **Enable MongoDB Atlas IP restrictions** (only Render IPs)
4. **Set up monitoring** for both services

---

## 📞 Support

If you encounter issues:
1. Check Render/Vercel logs first
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas connection

---

**Made with ❤️ by Jalaram Cards, Vadodara**
