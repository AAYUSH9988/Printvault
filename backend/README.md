# Printvault Backend API

Free print resources library API by **Jalaram Cards, Vadodara**.

## 🏗️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **File Storage**: Google Drive
- **Hosting**: Render (free tier)

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration & database connection
│   │   ├── index.ts      # Environment variables & settings
│   │   └── database.ts   # MongoDB connection handler
│   ├── controllers/      # Request handlers
│   │   └── resourceController.ts
│   ├── models/           # Mongoose schemas
│   │   └── Resource.ts   # Resource model (separate collections per category)
│   ├── routes/           # API route definitions
│   │   └── resourceRoutes.ts
│   ├── scripts/          # Utility scripts
│   │   └── seed.ts       # Database seeding script
│   ├── types/            # TypeScript interfaces
│   │   └── resource.ts
│   ├── utils/            # Helper functions
│   │   └── googleDrive.ts
│   ├── app.ts            # Express app configuration
│   └── server.ts         # Server entry point
├── .env                  # Environment variables (not committed)
├── .env.example          # Example environment file
├── package.json
└── tsconfig.json
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd Printvault/backend
npm install
```

### 2. Configure Environment

The `.env` file is already configured with your MongoDB URI. Verify it's correct:

```env
MONGODB_URI=mongodb+srv://your-connection-string
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Seed Sample Data (Optional)

```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api` | API info |
| GET | `/api/resources` | List all resources (paginated) |
| GET | `/api/resources/categories` | Get all categories with counts |
| GET | `/api/resources/tags` | Get all unique tags |
| GET | `/api/resources/featured` | Get featured resources |
| GET | `/api/resources/:slug` | Get single resource by slug |
| GET | `/api/resources/:slug/download?format=pdf` | Download resource file |
| GET | `/api/resources/:slug/related` | Get related resources |

### Query Parameters for `/api/resources`

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12, max: 100) |
| `category` | string | Filter by category |
| `tag` | string | Filter by tag |
| `q` | string | Search query |
| `featured` | boolean | Only featured items |
| `sort` | string | Sort by: newest, oldest, popular, title |

### Example Requests

```bash
# Get all resources
curl http://localhost:5000/api/resources

# Get Bhagwan category only
curl http://localhost:5000/api/resources?category=bhagwan

# Search for Ganesh
curl http://localhost:5000/api/resources?q=ganesh

# Get featured resources
curl http://localhost:5000/api/resources/featured

# Download PDF
curl -L http://localhost:5000/api/resources/lord-ganesha-traditional-line-art/download?format=pdf
```

## 📦 MongoDB Collections

Resources are organized into separate collections:

- `resources` - Unified collection (main)
- `bhagwan_resources` - Gods/Deities artwork
- `frames_resources` - Frames and borders
- `initials_resources` - Couple initial logos
- `templates_resources` - Full card templates
- `elements_resources` - Design elements

## 🔗 Google Drive Setup

1. Upload your PDF/CDR files to Google Drive
2. Right-click → Share → "Anyone with link can view"
3. Copy the file ID from the URL:
   - URL: `https://drive.google.com/file/d/FILE_ID_HERE/view`
   - File ID: `FILE_ID_HERE`
4. Store the file ID in MongoDB as `drivePdfId` or `driveCdrId`

### URL Formats

| Type | Format |
|------|--------|
| View | `https://drive.google.com/file/d/{FILE_ID}/view` |
| Download | `https://drive.google.com/uc?export=download&id={FILE_ID}` |
| Thumbnail | `https://drive.google.com/thumbnail?id={FILE_ID}&sz=w400` |

## 🚢 Deploy to Render

1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect your GitHub repo
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `MONGODB_URI`
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://your-frontend-domain.vercel.app`
6. Deploy!

## 📝 Adding New Resources

### Via MongoDB Compass

1. Connect to your cluster
2. Navigate to `printvault` database → `resources` collection
3. Insert document with all required fields

### Via Seed Script

1. Add resources to `src/scripts/seed.ts`
2. Run `npm run seed`

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run seed` | Seed database with sample data |

## 📄 License

MIT - Made with ❤️ by Jalaram Cards, Vadodara
