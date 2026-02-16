# Render Deployment Guide

This guide will walk you through deploying the Crowdfunding Platform to Render.

## Prerequisites

- GitHub account with this repository
- MongoDB Atlas account (free tier)
- Render account (free tier)

---

## Step 1: Set Up MongoDB Atlas (Free Cloud Database)

### 1.1 Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** and create an account
3. Choose **"M0 FREE"** tier when creating your cluster

### 1.2 Create a Cluster

1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier (shared cluster)
3. Select a cloud provider and region (choose one closest to you)
4. Click **"Create Cluster"** (takes 3-5 minutes)

### 1.3 Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `crowdfunding_user`)
5. Click **"Autogenerate Secure Password"** and **SAVE THIS PASSWORD**
6. Set privileges to **"Read and write to any database"**
7. Click **"Add User"**

### 1.4 Whitelist All IPs (for Render access)

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
4. Click **"Confirm"**

> **Note:** This allows connections from any IP. For production, you should restrict this to Render's IP ranges.

### 1.5 Get Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster.mongodb.net/`)
5. **Replace `<password>` with your actual password** from step 1.3
6. **Add database name** at the end: `mongodb+srv://username:password@cluster.mongodb.net/crowdfunding`

**Your final connection string should look like:**
```
mongodb+srv://crowdfunding_user:YourPassword123@cluster0.xxxxx.mongodb.net/crowdfunding
```

---

## Step 2: Push Code to GitHub

Make sure all your latest changes are pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Step 3: Deploy to Render

### 3.1 Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended for easy integration)

### 3.2 Create New Web Service

1. From Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub account if not already connected
3. Find and select your **`CrowdFunding-Platform`** repository
4. Click **"Connect"**

### 3.3 Configure Web Service

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `crowdfunding-platform` (or any name you prefer) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | Leave empty |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 3.4 Add Environment Variables

Scroll down to **"Environment Variables"** section and add the following:

Click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `DATABASELINK` | Your MongoDB Atlas connection string from Step 1.5 |
| `JWT_SECRET` | Any random secure string (at least 32 characters) |
| `EMAIL_USER` | Your Gmail address (optional, for email verification) |
| `EMAIL_PASS` | Your Gmail app password (optional) |

**Example JWT_SECRET:** `my-super-secret-jwt-key-for-crowdfunding-platform-2024`

> **Note:** For Gmail app password, follow this guide: [https://support.google.com/accounts/answer/185833](https://support.google.com/accounts/answer/185833)

### 3.5 Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will start building and deploying your app
3. Wait 3-5 minutes for the first deployment
4. You'll see build logs in real-time

---

## Step 4: Verify Deployment

Once deployment is complete:

1. Render will provide a URL like: `https://crowdfunding-platform-xxxx.onrender.com`
2. Click on the URL to open your application
3. You should see the registration page

### Test the Application

1. **Register a new user** (choose Startup Owner or Investor)
2. **Verify email** (if you configured email settings)
3. **Login** to your dashboard
4. **Create a campaign** (if you're a startup owner)
5. **Test real-time chat** - Open two browser windows and test messaging

---

## Troubleshooting

### Build Failed

- Check build logs in Render dashboard
- Ensure `package.json` has correct dependencies
- Verify Node.js version compatibility

### Application Crashes

- Check application logs in Render dashboard
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Database Connection Error

- Verify MongoDB Atlas connection string format
- Check that IP whitelist includes `0.0.0.0/0`
- Ensure database user has correct permissions
- Verify password doesn't contain special characters that need URL encoding

### Email Not Working

- Verify `EMAIL_USER` and `EMAIL_PASS` are set correctly
- Use Gmail App Password, not regular password
- Enable 2-factor authentication on Gmail first

---

## Important Notes

### Free Tier Limitations

- Render free tier apps **spin down after 15 minutes of inactivity**
- First request after spin-down may take 30-60 seconds
- MongoDB Atlas free tier has 512MB storage limit

### Upgrading

To upgrade to paid tier for better performance:
1. Go to Render dashboard
2. Select your service
3. Click **"Settings"** → **"Instance Type"**
4. Choose a paid plan

---

## Environment Variables Reference

Copy these to Render's environment variables section:

```
DATABASELINK=mongodb+srv://username:password@cluster.mongodb.net/crowdfunding
JWT_SECRET=your-secure-random-string-at-least-32-characters
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

---

## Support

If you encounter issues:
- Check Render logs: Dashboard → Your Service → Logs
- Check MongoDB Atlas logs: Atlas Dashboard → Monitoring
- Review application logs for specific error messages

---

## Next Steps

After successful deployment:
1. Test all features thoroughly
2. Configure custom domain (optional)
3. Set up monitoring and alerts
4. Consider upgrading to paid tier for production use
