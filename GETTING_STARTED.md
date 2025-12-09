# Getting Started with VetFlow

## What has been created

✅ **Complete monorepo architecture** with 3 packages:
- `@vetflow/shared` - Shared code (types, formulas, validators)
- `@vetflow/web` - Web application (React + Vite + TypeScript + Tailwind)
- `@vetflow/mobile` - Mobile application (React Native + Expo + NativeWind)

✅ **All base UI components** for both web and mobile:
- Button (4 variants: primary, secondary, ghost, danger)
- Input (with labels, errors, units, icons)
- Card (3 variants: default, outlined, elevated)
- Select (dropdown with options)
- Modal (with overlay and close functionality)
- Spinner (loading indicator)

✅ **Complete business logic**:
- RER/MER calculation formulas
- Energy requirement adjustments
- Kibble quantity calculations
- TypeScript types for all entities
- Zod validators for forms

✅ **Supabase configuration**:
- Database schema (users, croquettes, calculs, usage_tracking)
- Row Level Security policies
- Client configuration for web and mobile

## Prerequisites

Make sure you have installed:
- Node.js >= 18.0.0
- pnpm >= 8.0.0

Install pnpm if you don't have it:
```bash
npm install -g pnpm
```

## Installation

1. **Install all dependencies**:
```bash
cd /Users/jack/DEV/Vetflow
pnpm install
```

This will install dependencies for all packages (root, shared, web, mobile).

## Running the applications

### Web Application

```bash
# Run in development mode
pnpm dev:web

# Build for production
pnpm build:web
```

The web app will open at http://localhost:3000

### Mobile Application

```bash
# Start Expo development server
pnpm dev:mobile

# Or directly:
cd packages/mobile
pnpm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Project Structure

```
/Users/jack/DEV/Vetflow/
├── packages/
│   ├── shared/              # Shared package
│   │   └── src/
│   │       ├── types/       # TypeScript types
│   │       │   ├── animal.ts
│   │       │   ├── croquette.ts
│   │       │   ├── calculation.ts
│   │       │   └── user.ts
│   │       ├── lib/         # Business logic
│   │       │   ├── formulas.ts    # RER/MER calculations
│   │       │   ├── validators.ts  # Zod schemas
│   │       │   └── constants.ts   # App constants
│   │       └── index.ts     # Main exports
│   │
│   ├── web/                 # Web application
│   │   └── src/
│   │       ├── components/
│   │       │   └── ui/      # UI components
│   │       │       ├── Button.tsx
│   │       │       ├── Input.tsx
│   │       │       ├── Card.tsx
│   │       │       ├── Select.tsx
│   │       │       ├── Modal.tsx
│   │       │       ├── Spinner.tsx
│   │       │       └── index.ts
│   │       ├── lib/
│   │       │   ├── supabase.ts   # Supabase client
│   │       │   └── utils.ts      # Utilities
│   │       ├── styles/
│   │       │   └── globals.css   # Tailwind globals
│   │       ├── App.tsx           # Root component
│   │       └── main.tsx          # Entry point
│   │
│   └── mobile/              # Mobile application
│       ├── components/
│       │   └── ui/          # UI components (React Native)
│       │       ├── Button.tsx
│       │       ├── Input.tsx
│       │       ├── Card.tsx
│       │       ├── Select.tsx
│       │       ├── Modal.tsx
│       │       ├── Spinner.tsx
│       │       └── index.ts
│       ├── lib/
│       │   └── supabase.ts       # Supabase client
│       ├── App.tsx               # Entry point
│       └── app.json              # Expo config
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── config.toml
│
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # Workspace config
└── tsconfig.json            # Root TypeScript config
```

## Using the UI Components

### Web (React)

```typescript
import { Button, Input, Card } from '@/components/ui';

function MyComponent() {
  return (
    <Card title="Animal Information">
      <Input
        label="Weight"
        type="number"
        value={weight}
        onChange={setWeight}
        unit="kg"
        required
      />
      <Button variant="primary" onClick={handleSubmit}>
        Calculate
      </Button>
    </Card>
  );
}
```

### Mobile (React Native)

```typescript
import { Button, Input, Card } from '@/components/ui';
import { View } from 'react-native';

function MyScreen() {
  return (
    <View>
      <Card title="Animal Information">
        <Input
          label="Weight"
          value={weight}
          onChange={setWeight}
          unit="kg"
          required
          keyboardType="numeric"
        />
        <Button variant="primary" onPress={handleSubmit}>
          Calculate
        </Button>
      </Card>
    </View>
  );
}
```

## Using Shared Code

```typescript
import {
  calculateRER,
  calculateEnergyRequirement,
  animalInfoSchema,
  type AnimalInfo,
  type ObjectiveData,
} from '@vetflow/shared';

// Calculate energy requirement
const animalInfo: AnimalInfo = {
  species: 'dog',
  weight: 10,
  ageYears: 3,
  ageMonths: 0,
  isNeutered: true,
  bodyScore: 5,
};

const objectiveData: ObjectiveData = {
  goal: 'maintenance',
  activityLevel: 'moderate',
  physiologicalStatus: 'normal',
};

const result = calculateEnergyRequirement(animalInfo, objectiveData);
console.log(`RER: ${result.rer} kcal/day`);
console.log(`MER: ${result.mer} kcal/day`);

// Validate with Zod
const validationResult = animalInfoSchema.safeParse(animalInfo);
if (!validationResult.success) {
  console.error('Validation errors:', validationResult.error);
}
```

## Supabase Setup

1. **Create a Supabase project** at https://supabase.com

2. **Run the migration**:
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
cd /Users/jack/DEV/Vetflow
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

3. **Configure environment variables**:

For web (`packages/web/.env`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

For mobile (`packages/mobile/.env`):
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Next Steps

### Immediate priorities:
1. ✅ **Done**: Monorepo setup
2. ✅ **Done**: Shared package with types, formulas, validators
3. ✅ **Done**: Web & Mobile setup
4. ✅ **Done**: All base UI components
5. ✅ **Done**: Supabase configuration

### What's next:
1. **Create business components**:
   - AnimalInfoForm (étape 1 du calculateur)
   - ObjectiveForm (étape 2)
   - BEResult (affichage résultat)
   - CroquetteSelector (sélection croquettes)
   - QuantityResults (résultats finaux)

2. **Create pages**:
   - Landing page
   - Dashboard
   - Calculator (multi-step)
   - History
   - Settings

3. **Implement authentication**:
   - Login/Signup forms
   - Protected routes
   - User profile

4. **Connect to Supabase**:
   - CRUD operations for calculations
   - Croquettes database queries
   - Usage tracking

5. **Testing**:
   - Unit tests for formulas
   - Component tests
   - E2E tests

6. **Deployment**:
   - Web: Vercel or Netlify
   - Mobile: Expo EAS Build

## Development Tips

- **Hot reload works**: Changes in `shared` package will trigger reload in web/mobile
- **TypeScript paths**: Use `@vetflow/shared` to import from shared package
- **Tailwind classes**: Same classes work for both web (Tailwind CSS) and mobile (NativeWind)
- **Code sharing**: Business logic in `shared`, UI in platform-specific components

## Troubleshooting

### "Cannot find module '@vetflow/shared'"
Run `pnpm install` at the root to link workspaces.

### Web app doesn't start
Make sure you're in the root directory and run `pnpm dev:web`.

### Mobile app build fails
Delete `node_modules` and run `pnpm install` again.

### TypeScript errors in shared package
Run `pnpm --filter @vetflow/shared type-check` to see detailed errors.

## Documentation

- Full project documentation: `/Users/jack/DEV/Obsidian/ObsiBot/VetFlow/`
- Technical note for Claude: `🤖 Note Technique pour Claude - Vision Complète du Projet.md`
- Component architecture: `01 - Architecture Composants React.md`
- Complete project guide: `📌 README - Guide Complet du Projet.md`
