# GZU Online Application Portal

## Project Overview

The Great Zimbabwe University Online Application Portal is a modern web application that streamlines the university admission process. This platform allows prospective students to apply for undergraduate and postgraduate programs online, submit required documents, and track their application status.

## Features

- 🎓 **Multi-Step Application Form** - Intuitive form wizard for student applications
- 📝 **Student Information Management** - Comprehensive data collection including personal details, contact information, and academic history
- 📚 **Programme Selection** - Easy selection of desired academic programs
- 🔐 **Secure Authentication** - User registration and login system
- 📊 **Application Dashboard** - Track application progress and status
- 📱 **Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices

## Technologies Used

This project is built with modern web technologies:

- **Vite** - Lightning-fast build tool and development server
- **React 18** - UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript for better code quality
- **React Router** - Client-side routing and navigation
- **React Hook Form** - Performant form validation and management
- **Zod** - Schema validation for forms and data
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components
- **Lucide React** - Beautiful icon library
- **TanStack Query** - Data fetching and state management

## Getting Started

### Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or bun package manager

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd online-application

# Install dependencies (using npm)
npm install

# Or using bun (faster alternative)
bun install
```

### Development

```sh
# Start the development server
npm run dev

# The application will be available at http://localhost:8080
```

### Building for Production

```sh
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

### Testing

```sh
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
online-application/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── forms/       # Application form components
│   │   └── ui/          # shadcn/ui components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   └── main.tsx         # Application entry point
├── public/              # Static assets
└── package.json         # Project dependencies
```

## Application Forms

The application process includes multiple forms:

1. **Student Information** - Personal details and demographics
2. **Contact Details** - Address and communication information
3. **Programme Choice** - Selection of desired academic programs
4. **Ordinary Level** - O-Level academic qualifications
5. **Advanced Level** - A-Level academic qualifications
6. **Post School Qualifications** - Tertiary education details
7. **Mature Entry** - Alternative entry qualifications
8. **Employment History** - Work experience information

## Contributing

To contribute to this project:

1. Create a new branch for your feature
2. Make your changes following the existing code style
3. Test your changes thoroughly
4. Submit a pull request with a clear description

## License

This project is maintained by Great Zimbabwe University.

## Support

For technical support or inquiries, please contact the GZU IT Department.
