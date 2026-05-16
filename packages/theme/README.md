# @synova/theme

Unified design system and theme configuration for the entire Synova Workspace.

## Installation

```bash
npm install @synova/theme
# or
pnpm add @synova/theme
```

## Usage

### Colors

```typescript
import { colors, getColor, colorWithOpacity } from '@synova/theme';

// Use colors directly
const primaryBlue = colors.primary.blue; // '#0066FF'

// Get color by path
const teal = getColor('primary', 'teal'); // '#06B6D4'

// Create color with opacity
const blueWithOpacity = colorWithOpacity('#0066FF', 0.5); // 'rgba(0, 102, 255, 0.5)'
```

### Typography

```typescript
import { typography, textStyles, getTextStyle } from '@synova/theme';

// Use typography directly
const primaryFont = typography.fonts.primary;
const baseSize = typography.sizes.base; // '16px'

// Get predefined text styles
const heading1 = getTextStyle('h1');
const bodyText = textStyles.bodyBase;
```

### Tailwind CSS

```javascript
// tailwind.config.js
const themeConfig = require('@synova/theme/tailwind');

module.exports = {
  ...themeConfig,
  // Your additional config
};
```

## Color Palette

### Primary Colors

- **Blue**: `#0066FF` - Primary brand color
- **Purple**: `#7C3AED` - Accent color
- **Teal**: `#06B6D4` - Secondary accent

### Neutral Colors

- **Dark Gray**: `#1F2937` - Text, dark backgrounds
- **Medium Gray**: `#6B7280` - Secondary text
- **Light Gray**: `#F3F4F6` - Light backgrounds
- **White**: `#FFFFFF` - Primary background

### Status Colors

- **Success**: `#10B981` - Success states
- **Warning**: `#F59E0B` - Warning states
- **Error**: `#EF4444` - Error states
- **Info**: `#3B82F6` - Information states

## Typography

### Font Families

- **Primary**: Inter (UI and body text)
- **Heading**: Poppins (headings and titles)
- **Mono**: Fira Code (code and technical content)

### Font Sizes

| Size | Value |
|------|-------|
| xs   | 12px  |
| sm   | 14px  |
| base | 16px  |
| lg   | 18px  |
| xl   | 20px  |
| 2xl  | 24px  |
| 3xl  | 30px  |
| 4xl  | 36px  |
| 5xl  | 48px  |
| 6xl  | 60px  |

### Font Weights

- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

## Examples

### React Component

```typescript
import React from 'react';
import { colors, textStyles } from '@synova/theme';

export function Button() {
  return (
    <button
      style={{
        backgroundColor: colors.primary.blue,
        color: colors.neutral.white,
        ...textStyles.label,
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      Click me
    </button>
  );
}
```

### Tailwind CSS

```jsx
export function Card() {
  return (
    <div className="bg-neutral-light p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary-blue mb-4">
        Card Title
      </h2>
      <p className="text-base text-neutral-medium">
        Card content goes here
      </p>
    </div>
  );
}
```

## API Reference

### `getColor(category, colorName)`

Get a color value by category and name.

**Parameters:**
- `category`: 'primary' | 'neutral' | 'status'
- `colorName`: string

**Returns:** string | undefined

### `colorWithOpacity(hex, opacity)`

Create a color with opacity.

**Parameters:**
- `hex`: string (hex color code)
- `opacity`: number (0-1)

**Returns:** string (rgba color)

### `getTypography(category, typographyName)`

Get a typography value by category and name.

**Parameters:**
- `category`: 'fonts' | 'sizes' | 'weights' | 'lineHeights' | 'letterSpacing'
- `typographyName`: string

**Returns:** string | number | undefined

### `getTextStyle(styleName)`

Get a predefined text style.

**Parameters:**
- `styleName`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'bodyLarge' | 'bodyBase' | 'bodySmall' | 'label' | 'caption' | 'code'

**Returns:** Record<string, string | number>

## Contributing

Contributions are welcome! Please follow our [Contributing Guidelines](../../CONTRIBUTING.md).

## License

MIT - See [LICENSE](../../LICENSE) for details.
