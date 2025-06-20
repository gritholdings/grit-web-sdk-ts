# Grit Web SDK for TypeScript

A TypeScript SDK for integrating with the Grit platform, providing seamless access to AI agent capabilities and chat functionality.

**Preview**: https://platform.meetgrit.com/

## Overview

The Grit Web SDK for TypeScript enables developers to integrate Grit's AI agent platform into their web applications. Built with Next.js and AWS Amplify, it provides a robust foundation for creating conversational AI experiences.

### Key Features

- Real-time chat interface with AI agents
- Thread management and conversation history
- Model selection and configuration
- AWS Amplify integration for authentication and backend services
- TypeScript support for type safety
- Responsive UI components

## Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- AWS Account with Amplify access
- Git

## Installation

### 1. Clone the Repository

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure AWS Amplify

Generate the Amplify configuration file:

```bash
npx ampx generate outputs --app-id YOUR_APP_ID --branch main
```

> **Note**: Find your `YOUR_APP_ID` in AWS Console -> Amplify -> Overview -> App ID

### 4. Set Environment Variables

Configure the following environment variable in AWS Amplify:

1. Navigate to AWS Console → Amplify → Your App
2. Go to Hosting → Environment variables
3. Add the following variable:

```
Variable: NEXT_PUBLIC_API_BASE_URL
Value: https://your-backend-domain.com
```

> **Important**: Use your Grit backend custom domain, not the AWS domain.

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | Yes | - |

## Development

### Local Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://127.0.0.1:3000`.

## API Reference

### REST API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/agent/threads` | GET | List all threads |
| `/agent/threads` | POST | Create new thread |
| `/agent/threads/{id}` | GET | Get thread details |
| `/agent/threads/{id}` | DELETE | Delete thread |
| `/agent/chat` | POST | Send chat message |
| `/agent/models` | GET | List available models |

## Deployment

### Build for Production

Verify the build before deployment:

```bash
npm run build
```

### Deploy to AWS Amplify

1. Commit your changes:

```bash
git add .
git commit -m "Your descriptive commit message"
```

2. Push to trigger automatic deployment:

```bash
git push origin main
```

3. Monitor deployment progress in the [AWS Console](https://console.aws.amazon.com/)

## Support

- Documentation: [docs.meetgrit.com](https://docs.meetgrit.com)
- Inquiries: [Contact Form](https://www.meetgrit.com/contact-us/)