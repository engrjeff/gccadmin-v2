# GCC Admin v2

A modern church administration system built for Grace City Church to manage disciples, leaders, cell groups, and ministry activities.

## =� Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-7C3AED?style=for-the-badge&logo=clerk&logoColor=white)

</div>

### Core Technologies
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Styling**: TailwindCSS with Radix UI components
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives, Lucide React icons

### Development Tools
- **Code Quality**: Biome (formatting & linting)
- **Build**: Next.js
- **Runtime**: Node.js with TypeScript

## ( Features

### =e **Disciple Management**
- Comprehensive disciple profiles with personal information
- Track church status (NACS, ACS, Regular) and cell status
- Monitor process levels and spiritual growth
- Import disciples via Excel files
- Advanced filtering and search capabilities

### = **Leader Management**
- Primary leader profiles and hierarchies
- Leader-disciple relationships tracking
- Performance and ministry oversight tools

### =� **Cell Group Reporting**
- Digital cell group attendance tracking
- Real-time cell report creation and management
- Attendance history and analytics
- Member engagement metrics

### =� **Lesson Management**
- Lesson series organization and tracking
- Individual lesson content management
- Progress tracking for disciples
- Educational resource organization

### <� **Dashboard & Analytics**
- Ministry overview and key metrics
- Visual charts and progress indicators
- Administrative insights and reports

### = **Authentication & Authorization**
- Secure login with Clerk integration
- Role-based access control (Admin/User)
- Protected routes and API endpoints

### =� **Data Management**
- Excel import/export functionality
- Data pagination and efficient queries
- Real-time updates with optimistic UI
- Robust error handling and validation

## =� Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gccadmin-v2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Configure your DATABASE_URL and Clerk keys
   ```

4. **Run database migrations**
   ```bash
   pnpm prisma migrate deploy
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3008](http://localhost:3008) to see the application.

## =� Available Scripts

- `pnpm dev` - Start development server on port 3008
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linting
- `pnpm format` - Format code with Biome

---

*Built for Grace City Church*

Made by [Jeff Segovia](https://jeffsegovia.dev).
