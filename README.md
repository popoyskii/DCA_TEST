# AI-Driven Resource Allocation System for Construction Projects

![System Screenshot](https://imgur.com/g4kZLo0.png)

An AI-powered construction project management and resource allocation platform developed to improve operational efficiency, project coordination, and decision-making for construction environments.

This system integrates GPT-4-powered analysis with an interactive dashboard to assist project managers in monitoring workflows, allocating resources, and generating AI-assisted recommendations for ongoing construction projects.

---

## Overview

The platform was developed as a capstone project focused on applying AI technologies to real-world construction management problems.

Users can:

- Monitor and manage construction projects
- Organize workflows through drag-and-drop functionality
- Access project-specific data and updates
- Receive AI-generated recommendations and summaries
- Generate GPT-based prescriptive analysis for decision-making support
- Improve operational efficiency through centralized project tracking

The system aims to reduce manual analysis and support faster, data-driven decision-making in construction project operations.

---

## Features

- GPT-4-powered AI assistant
- AI-generated project recommendations
- Prescriptive analysis and summaries
- Interactive drag-and-drop dashboard
- Project monitoring and workflow tracking
- Centralized project management interface
- Responsive and modern UI

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend / APIs

- Next.js API Routes
- OpenAI GPT-4 API Integration
- Appwrite Cloud Database

### Other Tools

- Zustand (State Management)
- REST APIs

---

## Project Structure

```bash
/app
 ├── api/                          # Backend API routes (AI + system logic)
 │    ├── convert/route.ts
 │    ├── generateRecommand/route.ts
 │    ├── generateSummary/route.ts
 │    ├── getGptRecommend/route.ts
 │    ├── openai/
 │    │     ├── GetSummary/route.ts
 │    │     ├── Rub/route.ts
 │
 ├── favicon.ico
 ├── globals.css
 ├── layout.tsx
 ├── page.tsx                     # Main dashboard entry point

/components              # Reusable UI components
 ├── ArchiveModal.tsx
 ├── Board.tsx
 ├── ChangelogList.tsx
 ├── ChangelogModal.tsx
 ├── ChartModal.tsx
 ├── Column.tsx
 ├── CostChart.tsx
 ├── DateModal.tsx
 ├── Header.tsx
 ├── LoginModal.tsx
 ├── Modal.tsx
 ├── TaskTypeRadioGroup.tsx
 ├── ToastProvider.tsx
 ├── TodoCard.tsx
 ├── UserActions.tsx

/images                  # Static assets

/lib                     # Core logic & utilities
 ├── addChangelog.ts
 ├── fetchSuggestion.ts
 ├── fetchUser.ts
 ├── fetchUserDetails.ts
 ├── formatTodosForAI.ts
 ├── getCurrentUser.ts
 ├── getProjectData.ts
 ├── getTodosGroupedByColumn.ts
 ├── getUrl.ts
 ├── uploadData.ts
 ├── uploadImage.ts
```

---

## My Contributions

- Developed frontend and backend functionalities
- Integrated GPT-4 for AI-assisted analysis and recommendations
- Designed interactive dashboard workflows
- Implemented state management and API communication
- Worked on system architecture and application logic
- Assisted in improving UX and operational workflow efficiency

---

## Other Screenshots

## AI Chart Live Analysis

![Dashboard](https://imgur.com/TRbnX9W.png)

![Changelogs] (https://imgur.com/mwnAoip.png)

![Dashboard](https://i.imgur.com/lm8KGHE.png)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open your browser at:

```bash
http://localhost:3000
```

---

## Future Improvements

- Led the overall development and implementation of the system
- Developed both frontend and backend functionalities using Next.js and TypeScript
- Integrated GPT-4 APIs for AI-assisted recommendations and project summaries
- Designed and implemented the dashboard UI and workflow system
- Built modular API routes for AI processing and backend communication
- Managed application state, data flow, and system architecture
- Implemented project monitoring, task management, and reporting features
- Handled debugging, optimization, testing, and overall system integration

---

## Repository Purpose

This repository showcases the implementation of an AI-assisted construction management and resource allocation system developed as a capstone project.
