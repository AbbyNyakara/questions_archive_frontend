# Questions Archive - Frontend Application

## Project Overview

A modern React-based frontend application built with Vite and TypeScript for accessing and managing archived questions. This application interfaces with a dedicated backend API service to provide a seamless user experience for question management.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 4.x | Build Tool & Dev Server |
| CSS Modules/Tailwind | - | Styling |
| Axios/Fetch API | - | HTTP Client |

## Prerequisites

### System Requirements
- **Node.js** (LTS version 18.x or higher recommended)
- **Package Manager**: Yarn (preferred), npm, or pnpm
- **Backend Service**: Must be running locally

### Backend Dependencies
Ensure the backend service is operational and accessible at: ```http://localhost/api-docs```


## Quick Start Guide

### Step 1: Repository Setup
```bash
# Clone the repository
git clone https://github.com/Afrobarometer/Frontend-QuestionsLibrary.git

# Navigate to frontend directory
cd Frontend-QuestionsLibrary

```

### Step 2: Install Dependencies

```bash
# Using Yarn (recommended)
yarn install

# Alternative using npm
npm install

# Alternative using pnpm
pnpm install

```

### Environment Configuration

# Required: Backend API Base URL
VITE_BASE_URL=http://localhost/api

### Development
Running the Application

```bash
yarn dev

```