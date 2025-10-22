# QuizQuest - AI-Powered Learning Platform

## Overview

QuizQuest is an innovative AI-powered educational platform that revolutionizes quiz creation and assessment. Built with React, TypeScript, and modern web technologies, it empowers educators to create engaging assessments while making learning interactive for students.

## Features

## 1. User Authentication & Registration

### Teacher Registration
- Create account with email verification
- Complete profile setup
- Add professional details and subjects taught

### Student Registration
- Create account with email verification
- Complete profile setup
- Search and connect with teachers

## 2. Dashboard Features

### Teacher Dashboard
- Profile management
- Student connection requests
- Course management
- Quiz creation and management
- Reports and analytics

### Student Dashboard
- Profile management
- Teacher search functionality
- Course enrollment status
- Available quizzes
- Performance reports

## 3. Quiz Creation System

### AI-Powered Question Generation
- Upload document support:
  - PDF files
  - Word documents
  - PowerPoint presentations
- Topic-based generation:
  - Specify subject/topic
  - Set difficulty level
  - Automatic question generation

### Manual Question Management
- Create custom questions
- Edit AI-generated questions
- Organize question banks
- Set question properties

## 4. Quiz Access Control

### Attendance Management
- Mark student attendance
- Set attendance criteria
- Allow/disallow quiz access based on attendance

### Quiz Settings
- Questions per page configuration
- Question randomization
- Option shuffling
- Custom marking scheme

## 5. Quiz Execution

### Timer Features
- Set overall quiz duration
- Individual question timers (optional)
- Auto-submit on time expiry

### Display Settings
- Configurable questions per page
- Question shuffling
- Option shuffling
- Progress indicator

## 6. Report Generation

### Teacher Reports
- Student-wise performance analysis
- Quiz statistics
- Downloadable PDF reports
- Custom report filters

### Student Reports
- Performance analytics
- Answer review
- Progress tracking
- Score history


## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **UI Components**: Shadcn/ui
- **State Management**: React Query
- **Routing**: React Router 
- **Styling**: TailwindCSS + CSS Modules
- **Icons**: Lucide Icons
- **Forms**: React Hook Form + Zod

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/codebymabish/FrontEnd-React-Assignment-1.git
cd FrontEnd-React-Assignment-1
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

```

## Project Structure

```
FrontEnd-React-Assignment-1/
├── public/             # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   └── App.tsx         # Root component
└── package.json        # Project dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production


## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## Best Practices

- Follow the [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- Use functional components and hooks
- Write meaningful commit messages
- Add appropriate comments and documentation
- Follow the established code style


## Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
- [Lucide Icons](https://lucide.dev/)

---

Made with ❤️ by QuizQuest-1 Team Section-C(008,031,178) .
