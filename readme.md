# Portfolio Management System

A full-stack application for scraping, storing, and displaying creative portfolios with client work and video content.

## 🏗️ System Architecture

### Frontend (Next.js + React)
- **Next.js 14** with App Router
- **React 18** with modern hooks
- **Tailwind CSS** for styling
- **Lucide React** for icons
- Responsive design with mobile-first approach

### Backend (Laravel)
- **Laravel 12** with PHP 8.2
- **RESTful API** architecture
- **MySQL** database with optimized indexing
- **Guzzle HTTP** for web scraping
- **Symfony DomCrawler** for HTML parsing

### Database Structure
```sql
portfolios
├── id (Primary Key)
├── portfolio_url (Unique, Indexed)
├── scraped_data (JSON)
├── created_at
└── updated_at

clients
├── id (Primary Key)
├── portfolio_id (Foreign Key, Indexed)
├── name (Indexed)
├── created_at
└── updated_at

videos
├── id (Primary Key)
├── client_id (Foreign Key, Indexed)
├── title
├── video_url (Indexed)
├── thumbnail_url
├── created_at
└── updated_at
```

## 🚀 Features

### Core Functionality
- **Portfolio URL Submission**: Users can submit portfolio URLs for scraping
- **Intelligent Web Scraping**: Supports generic portfolios
- **Client Detection**: Automatically identifies client names and work
- **Video Extraction**: Finds YouTube/Vimeo videos and generates thumbnails
- **Responsive Display**: Beautiful, mobile-friendly portfolio viewer

### Advanced Features
- **Rate Limiting**: Prevents abuse of scraping endpoints
- **Error Handling**: Comprehensive logging and user feedback
- **Search & Filter**: Find portfolios by client or content
- **Pagination**: Efficient data loading for large datasets

## 📊 API Endpoints

### Portfolio Management
```
POST   /api/portfolios              # Submit new portfolio URL
GET    /api/portfolios              # List all portfolios (paginated)
GET    /api/portfolios/{id}         # Get specific portfolio details
DELETE /api/portfolios/{id}         # Delete portfolio
```

## 🗄️ Database Optimization

### Indexing Strategy
- **portfolio_url**: Unique index for fast URL lookups
- **clients.portfolio_id**: Foreign key index for joins
- **clients.name**: Index for client name searches
- **videos.client_id**: Foreign key index for video retrieval
- **videos.video_url**: Index for duplicate detection

### Query Optimization
- **Eager Loading**: Prevent N+1 queries with `$portfolio->load(['clients.videos'])`
- **Selective Fields**: Only fetch required columns

### Performance Considerations
```php
// Optimized query example
Portfolio::with(['clients' => function($query) {
    $query->select('id', 'portfolio_id', 'name')
          ->with(['videos' => function($subQuery) {
              $subQuery->select('id', 'client_id', 'title', 'video_url', 'thumbnail_url');
          }]);
}])->paginate(10);
```

## 🛠️ Installation & Setup

### Prerequisites
- **PHP 8.2**
- **Composer**
- **MySQL 8.0+**

### Backend Setup (Laravel)
```bash
# Clone repository
git clone https://github.com/himanshu-malviya15/portfolio-extract
cd portfolio-extract/backend

# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate

# Start server
php artisan serve
```

### Frontend Setup (Next.js)
```bash
cd ../frontend

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
cp .env.example .env
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🎯 Key Technical Decisions

### Web Scraping Strategy
- **User-Agent Rotation**: Prevents blocking
- **Timeout Handling**: 30-second timeout with retries
- **SSL Verification**: Disabled for development (enable in production)
- **Platform-Specific Parsers**: generic portfolio handling

### Data Storage Approach
- **Normalized Schema**: Separate tables for portfolios, clients, videos
- **JSON Storage**: Raw scraped data stored for debugging
- **Thumbnail Generation**: Automatic YouTube thumbnail URLs
- **URL Normalization**: Consistent video URL formats

### Frontend Architecture
- **Component Composition**: Reusable UI components
- **State Management**: React hooks for local state
- **Error Boundaries**: Graceful error handling
- **Loading States**: Better user experience

## 🔧 Use of AI Tools

### AI-Assisted Development
I used AI tools strategically throughout this project:

#### Key Prompts Used:
1. **Database Schema Design**: "Design an optimized database schema for storing portfolio data with clients and videos, focusing on query performance"
2. **Web Scraping Logic**: "Create a robust web scraper that can handle different portfolio platforms like Canva"

#### Manual Modifications:
- **Error Handling**: Enhanced AI-generated code with comprehensive try-catch blocks
- **Performance Optimization**: Added database indexing and query optimization
- **UI Polish**: Improved animations and responsive design beyond AI suggestions
- **Security**: Added input validation and sanitization

#### Creative AI Usage:
- **Code Generation**: Used GitHub Copilot for boilerplate API routes
- **Regex Patterns**: AI helped create robust URL and client name detection patterns
- **CSS Animations**: Generated smooth transitions and hover effects
- **Test Cases**: AI assisted in creating comprehensive test scenarios

### What I Built Manually:
- **System Architecture**: Overall application structure and data flow
- **Business Logic**: Portfolio scraping algorithms and client detection
- **Performance Optimizations**: Database indexing and caching strategies
- **Error Recovery**: Retry mechanisms and fallback strategies

## 🚀 Scalability Considerations

### Performance Optimization
- **Queue System**: Background processing for scraping tasks
- **Database Optimization**: Read replicas and connection pooling
- **Rate Limiting**: Prevent abuse and manage resource usage

## 📈 Future Enhancements

### Phase 2 Features
- **Real-time Updates**: WebSocket notifications for scraping progress
- **Bulk Operations**: Import multiple portfolios via CSV
- **Export Options**: PDF/Excel portfolio reports

### Phase 3 Features
- **AI Content Analysis**: Automatic tagging and categorization
- **Portfolio Comparison**: Side-by-side portfolio analysis
- **Client Portal**: Dedicated views for individual clients
