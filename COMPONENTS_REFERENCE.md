# VetFlow UI Components Reference

Complete reference for all UI components available in VetFlow (Web & Mobile).

## Table of Contents

1. [Button](#button)
2. [Input](#input)
3. [Card](#card)
4. [Select](#select)
5. [Modal](#modal)
6. [Spinner](#spinner)

---

## Button

Reusable button component with multiple variants and sizes.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `isLoading` | `boolean` | `false` | Loading state (shows spinner) |
| `disabled` | `boolean` | `false` | Disabled state |
| `leftIcon` | `ReactNode` | - | Icon on the left |
| `rightIcon` | `ReactNode` | - | Icon on the right |
| `children` | `ReactNode` | - | Button content |
| `onClick/onPress` | `() => void` | - | Click handler |

### Examples

#### Primary Button (Web)
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={() => console.log('clicked')}>
  Calculer
</Button>
```

#### Primary Button (Mobile)
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onPress={() => console.log('pressed')}>
  Calculer
</Button>
```

#### Loading Button
```tsx
<Button variant="primary" isLoading={true}>
  Chargement...
</Button>
```

#### Button with Icons
```tsx
<Button
  variant="secondary"
  leftIcon={<PlusIcon />}
  rightIcon={<ArrowIcon />}
>
  Ajouter
</Button>
```

#### All Variants
```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
```

---

## Input

Reusable input field with label, error, hint, and unit support.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label (required) |
| `type` | `'text' \| 'email' \| 'password' \| 'number'` | `'text'` | Input type |
| `value` | `string \| number` | - | Current value |
| `onChange` | `(value: string) => void` | - | Change handler |
| `error` | `string` | - | Error message |
| `hint` | `string` | - | Hint text |
| `required` | `boolean` | `false` | Required indicator (*) |
| `disabled` | `boolean` | `false` | Disabled state |
| `unit` | `string` | - | Unit suffix (e.g., "kg") |
| `leftIcon` | `ReactNode` | - | Icon on the left (web only) |
| `placeholder` | `string` | - | Placeholder text |
| `min`, `max`, `step` | `number` | - | Number constraints |

### Examples

#### Basic Text Input
```tsx
import { Input } from '@/components/ui';

<Input
  label="Nom de l'animal"
  type="text"
  value={name}
  onChange={setName}
  placeholder="Ex: Max"
/>
```

#### Number Input with Unit
```tsx
<Input
  label="Poids actuel"
  type="number"
  value={weight}
  onChange={setWeight}
  unit="kg"
  min={0.1}
  max={100}
  step={0.1}
  required
/>
```

#### Input with Error
```tsx
<Input
  label="Poids"
  type="number"
  value={weight}
  onChange={setWeight}
  error="Le poids doit être supérieur à 0"
  required
/>
```

#### Input with Hint
```tsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  hint="Nous ne partagerons jamais votre email"
/>
```

---

## Card

Reusable card container for grouping content.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Card title |
| `subtitle` | `string` | - | Card subtitle |
| `children` | `ReactNode` | - | Card content |
| `footer` | `ReactNode` | - | Footer content |
| `variant` | `'default' \| 'outlined' \| 'elevated'` | `'default'` | Visual variant |
| `padding` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding size |
| `hoverable` | `boolean` | `false` | Hover effect (web) |
| `pressable` | `boolean` | `false` | Press effect (mobile) |
| `onClick/onPress` | `() => void` | - | Click/press handler |

### Examples

#### Basic Card
```tsx
import { Card } from '@/components/ui';

<Card title="Informations animal" subtitle="Étape 1/3">
  <p>Contenu de la carte...</p>
</Card>
```

#### Elevated Card with Footer
```tsx
<Card
  variant="elevated"
  title="Résultat du calcul"
  footer={
    <>
      <Button variant="secondary">Annuler</Button>
      <Button variant="primary">Sauvegarder</Button>
    </>
  }
>
  <p>BE: 350 kcal/jour</p>
</Card>
```

#### Outlined Card
```tsx
<Card variant="outlined" title="Important">
  <p>Information importante...</p>
</Card>
```

#### Clickable Card (Web)
```tsx
<Card
  hoverable
  onClick={() => console.log('Card clicked')}
  title="Calcul récent"
>
  <p>Sirah - 6.8kg - 08/12/24</p>
</Card>
```

#### Pressable Card (Mobile)
```tsx
<Card
  pressable
  onPress={() => console.log('Card pressed')}
  title="Calcul récent"
>
  <Text>Sirah - 6.8kg - 08/12/24</Text>
</Card>
```

---

## Select

Reusable dropdown select component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Select label (required) |
| `options` | `SelectOption[]` | - | Available options |
| `value` | `string` | - | Current value |
| `onChange` | `(value: string) => void` | - | Change handler |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message |
| `required` | `boolean` | `false` | Required indicator (*) |
| `disabled` | `boolean` | `false` | Disabled state |

### SelectOption Type
```typescript
interface SelectOption {
  value: string;
  label: string;
}
```

### Examples

#### Basic Select
```tsx
import { Select } from '@/components/ui';

const speciesOptions = [
  { value: 'dog', label: 'Chien' },
  { value: 'cat', label: 'Chat' },
];

<Select
  label="Espèce"
  options={speciesOptions}
  value={species}
  onChange={setSpecies}
  required
/>
```

#### Select with Placeholder
```tsx
<Select
  label="Objectif nutritionnel"
  options={goalOptions}
  value={goal}
  onChange={setGoal}
  placeholder="Sélectionnez un objectif"
/>
```

#### Select with Error
```tsx
<Select
  label="Niveau d'activité"
  options={activityOptions}
  value={activity}
  onChange={setActivity}
  error="Veuillez sélectionner un niveau d'activité"
  required
/>
```

---

## Modal

Reusable modal dialog component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Whether modal is visible |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Modal title |
| `children` | `ReactNode` | - | Modal content |
| `footer` | `ReactNode` | - | Footer content (buttons) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant (web only) |

### Examples

#### Basic Modal
```tsx
import { Modal, Button } from '@/components/ui';

const [isOpen, setIsOpen] = useState(false);

<>
  <Button onClick={() => setIsOpen(true)}>
    Ouvrir la modal
  </Button>

  <Modal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Confirmation"
  >
    <p>Êtes-vous sûr de vouloir continuer ?</p>
  </Modal>
</>
```

#### Modal with Footer Actions
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Exporter en PDF"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Annuler
      </Button>
      <Button variant="primary" onClick={handleExport}>
        Exporter
      </Button>
    </>
  }
>
  <p>Choisissez les options d'export...</p>
</Modal>
```

#### Large Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Détails du calcul"
  size="lg"
>
  <div>Contenu détaillé...</div>
</Modal>
```

---

## Spinner

Reusable loading spinner component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` (web)<br>`'small' \| 'large'` (mobile) | `'md'` / `'large'` | Spinner size |
| `color` | `string` | `'#2563eb'` | Spinner color |

### Examples

#### Basic Spinner
```tsx
import { Spinner } from '@/components/ui';

<Spinner />
```

#### Small Spinner
```tsx
<Spinner size="sm" />  // Web
<Spinner size="small" />  // Mobile
```

#### Custom Color
```tsx
<Spinner color="#ef4444" />  // Red spinner
```

#### Loading State
```tsx
{isLoading ? (
  <Spinner />
) : (
  <div>Content loaded!</div>
)}
```

#### Centered Spinner
```tsx
// Web
<div className="flex items-center justify-center min-h-screen">
  <Spinner size="lg" />
</div>

// Mobile
<View className="flex-1 items-center justify-center">
  <Spinner size="large" />
</View>
```

---

## Complete Form Example

### Web
```tsx
import { Input, Select, Button, Card } from '@/components/ui';
import { useState } from 'react';

function AnimalInfoForm() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [weight, setWeight] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    // Validation and submit logic
  };

  return (
    <Card title="Informations animal" subtitle="Étape 1/3">
      <div className="space-y-4">
        <Input
          label="Nom de l'animal"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Ex: Max"
        />

        <Select
          label="Espèce"
          options={[
            { value: 'dog', label: 'Chien' },
            { value: 'cat', label: 'Chat' },
          ]}
          value={species}
          onChange={setSpecies}
          required
          error={errors.species}
        />

        <Input
          label="Poids actuel"
          type="number"
          value={weight}
          onChange={setWeight}
          unit="kg"
          min={0.1}
          max={100}
          step={0.1}
          required
          error={errors.weight}
        />

        <Button variant="primary" size="lg" onClick={handleSubmit}>
          Continuer →
        </Button>
      </div>
    </Card>
  );
}
```

### Mobile
```tsx
import { Input, Select, Button, Card } from '@/components/ui';
import { View } from 'react-native';
import { useState } from 'react';

function AnimalInfoScreen() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [weight, setWeight] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    // Validation and submit logic
  };

  return (
    <View className="p-4">
      <Card title="Informations animal" subtitle="Étape 1/3">
        <View className="space-y-4">
          <Input
            label="Nom de l'animal"
            value={name}
            onChange={setName}
            placeholder="Ex: Max"
          />

          <Select
            label="Espèce"
            options={[
              { value: 'dog', label: 'Chien' },
              { value: 'chat', label: 'Chat' },
            ]}
            value={species}
            onChange={setSpecies}
            required
            error={errors.species}
          />

          <Input
            label="Poids actuel"
            value={weight}
            onChange={setWeight}
            unit="kg"
            required
            keyboardType="numeric"
            error={errors.weight}
          />

          <Button variant="primary" size="lg" onPress={handleSubmit}>
            Continuer →
          </Button>
        </View>
      </Card>
    </View>
  );
}
```

---

## Styling Guidelines

### Tailwind Classes

All components use Tailwind CSS classes. Common patterns:

- **Spacing**: `gap-2`, `space-y-4`, `p-4`, `px-6 py-3`
- **Colors**: `text-primary-600`, `bg-secondary-100`, `border-danger-500`
- **Typography**: `text-sm`, `font-medium`, `text-base`
- **Layout**: `flex`, `items-center`, `justify-between`
- **Rounded**: `rounded-lg`, `rounded-xl`
- **Shadows**: `shadow-sm`, `shadow-lg`

### Color Palette

- **Primary** (blue): `primary-50` to `primary-950`
- **Secondary** (gray): `secondary-50` to `secondary-950`
- **Danger** (red): `danger-50` to `danger-950`
- **Success** (green): `success-50` to `success-950`

### Responsive Design

Use Tailwind responsive prefixes:
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half on tablet, third on desktop */}
</div>
```

---

## Accessibility

All components follow accessibility best practices:

- ✅ Semantic HTML elements
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Focus indicators (`focus-ring` class)
- ✅ Screen reader support
- ✅ Color contrast ratios (WCAG AA)

---

## Contributing

When creating new components:

1. **Use English** for variable and function names
2. **Follow the existing patterns** (variants, sizes, props)
3. **Support both web and mobile** when applicable
4. **Add TypeScript types** for all props
5. **Use Tailwind classes** for styling
6. **Include JSDoc comments** for documentation
7. **Export from index.ts**
