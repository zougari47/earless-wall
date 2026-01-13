# Agents Guide for Earless Wall

## Project Overview

Earless Wall is an E2E encrypted real-time chat application built with React Native and Expo. It uses Supabase for authentication and real-time messaging, with end-to-end encryption using public/private key pairs stored locally.

**⚠️ IMPORTANT: This project targets both web and native platforms simultaneously.** When making changes, ensure compatibility with:

- **Web browsers** (SSR considerations, localStorage vs AsyncStorage)
- **iOS/Android** (React Native APIs, AsyncStorage)
- **Cross-platform compatibility** is required for all features

## Architecture

### Tech Stack

- **Framework**: Expo Router with React Native 0.81.5
- **Language**: TypeScript with strict mode enabled
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State**: React hooks and context
- **Backend**: Supabase (Auth + Realtime)
- **UI**: Custom component library with @rn-primitives

### Directory Structure

```
app/           # Expo Router pages (file-based routing)
components/    # Reusable UI components
  ui/         # Base UI primitives (Button, Card, Input, etc.)
lib/          # Utilities and configurations
```

## Code Style Guidelines

### Import Organization

```typescript
// 1. React/React Native imports
import React from 'react';
import { View, Text } from 'react-native';

// 2. Third-party libraries
import { Button } from '@rn-primitives/slot';
import { createClient } from '@supabase/supabase-js';

// 3. Internal imports (use @/* alias)
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
```

### Component Structure

- Use functional components with React hooks
- Export named components, not default exports
- Use TypeScript interfaces for props
- Follow the existing UI component patterns with `class-variance-authority`

```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  onPress?: () => void;
}

export function Button({ variant = 'default', size = 'default', onPress }: ButtonProps) {
  return (
    <Pressable className={buttonVariants({ variant, size })} onPress={onPress}>
      {/* content */}
    </Pressable>
  );
}
```

### Styling Guidelines

- Use NativeWind classes with `className` prop
- Define variants using `class-variance-authority` (CVA)
- Use semantic color tokens from the theme system
- Platform-specific code should use `Platform.select()`

```typescript
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
    },
    size: {
      default: 'h-10 px-4',
      sm: 'h-9 px-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
```

### TypeScript Configuration

- Strict mode enabled
- Path aliasing: `@/*` maps to project root
- Always type props and return values
- Use `React.ComponentProps` for extending native component props
- **Platform-specific imports** should be properly typed for cross-platform compatibility

### Error Handling

- Use try-catch blocks for async operations
- Implement proper error boundaries for component-level errors
- Supabase errors should be caught and user-friendly messages shown

### Naming Conventions

- **Components**: PascalCase with descriptive names (`SignUpForm`, `ChatMessage`)
- **Files**: PascalCase for components (`SignUpForm.tsx`), camelCase for utilities (`supabase.ts`)
- **Variables**: camelCase (`passwordInputRef`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE for exports (`THEME`, `NAV_THEME`)

### Security Considerations

- Private encryption keys stored in AsyncStorage
- Public keys uploaded to Supabase user metadata
- Environment variables for Supabase configuration
- Never commit `.env` files or API keys

### Cross-Platform Development

- **Storage**: Use platform-specific adapters (localStorage for web, AsyncStorage for native)
- **SSR Compatibility**: Check `typeof window !== 'undefined'` before browser APIs
- **Platform Detection**: Use `Platform.OS === 'web'` for web-specific code
- **Universal APIs**: Prefer cross-platform solutions over platform-specific code
- **Testing**: Always test on both web and native platforms

## UI Component Patterns

### Base Components

- Extend from `@rn-primitives` for consistent behavior
- Use `TextClassContext` for text styling inheritance
- Implement proper accessibility props (`role`, `aria-level`)

### Form Components

- Use refs for input focus management
- Implement proper keyboard handling (`returnKeyType`, `onSubmitEditing`)
- Use semantic HTML-like structure with native components

### Theme System

- Light/dark theme support via NativeWind
- CSS custom properties for colors in `global.css`
- Consistent semantic color tokens across the app

## Environment Setup

### Required Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Package Manager

This project uses pnpm with hoisted node linking (configured in `.npmrc`).

## Key Integration Points

### Supabase Integration

- Custom storage adapter using AsyncStorage
- Session persistence and auto-refresh enabled
- Realtime subscriptions for encrypted message delivery
- **SSR-safe client initialization** to prevent "window is not defined" errors
- **Universal storage adapter** that works on both web (localStorage) and native (AsyncStorage)

### Expo Router

- File-based routing in `app/` directory
- Layout component at `app/_layout.tsx`
- No headers shown by default (`headerShown: false`)

### NativeWind

- Tailwind preset extended for React Native
- Custom theme colors defined in `tailwind.config.js`
- Platform-specific styling with `Platform.select()`

## Development Notes

- When adding new components, check existing `components/ui/` for patterns
- Use the `cn()` utility from `lib/utils.ts` for class merging
- Theme colors available via HSL CSS custom properties
- Encryption key management should remain local to the device
- All user data should be encrypted before sending to Supabase
- **Always test cross-platform**: Features must work on both web and mobile
- **SSR considerations**: Check for browser APIs before using them
- **Storage abstraction**: Use provided storage adapter for data persistence
