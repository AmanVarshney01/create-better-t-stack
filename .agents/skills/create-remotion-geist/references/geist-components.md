# Geist Components Reference

Key props and patterns for representing Geist components in Remotion videos.

**IMPORTANT:** Never use emoji characters. Use icons from `@geist-ui/icons` package.

## Button

```tsx
type: 'default' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'alert' | 'cyan'
size: 'tiny' | 'small' | 'medium' | 'large'
shape: 'square' | 'circle' | 'rounded'
variant: 'shadow' | 'invert' | 'unstyled'
```

**Visual representation:**
```tsx
// Primary button
<div className="px-4 py-2 rounded-md bg-white text-black font-medium text-sm">
  Confirm
</div>

// Secondary button
<div className="px-4 py-2 rounded-md border border-gray-400 text-gray-300 text-sm">
  Cancel
</div>
```

## Modal

**Structure:**
```
Modal.Modal → Modal.Body → Modal.Header → Modal.Title
                        → Content
                        → Modal.Actions
```

**Visual representation:**
```tsx
import { X } from '@geist-ui/icons';

<div className="bg-background-100 border border-gray-400 rounded-lg shadow-2xl" style={{ width: 400 }}>
  {/* Header */}
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-400">
    <span className="text-white font-semibold text-xl">Modal Title</span>
    <X size={20} color="#737373" />
  </div>
  {/* Content */}
  <div className="px-6 py-6 text-gray-400">Content goes here...</div>
  {/* Actions */}
  <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-400">
    <button className="px-4 py-2 rounded-md border border-gray-400 text-gray-300">Cancel</button>
    <button className="px-4 py-2 rounded-md bg-white text-black font-medium">Confirm</button>
  </div>
</div>
```

## Note

```tsx
type: 'error' | 'warning' | 'success' | 'secondary' | 'default'
fill: boolean  // fills background
size: 'xSmall' | 'small' | 'mediumSmall' | 'large'
```

**Icons:** success=CheckCircle (green), error=XCircle (red), warning=AlertTriangle (amber)

**Visual representation:**
```tsx
import { AlertTriangle, CheckCircle } from '@geist-ui/icons';

// Warning note
<div className="flex items-center gap-4 px-6 py-4 rounded-lg"
  style={{ backgroundColor: '#FFB22415', border: '1px solid #FFB22440' }}>
  <AlertTriangle size={20} color="#FFB224" />
  <span className="text-amber-700">Warning message</span>
</div>

// Success note (uses GREEN)
<div className="flex items-center gap-4 px-6 py-4 rounded-lg"
  style={{ backgroundColor: '#46A75815', border: '1px solid #46A75840' }}>
  <CheckCircle size={20} color="#46A758" />
  <span className="text-green-700">Success message</span>
</div>
```

## Badge

```tsx
variant: 'gray' | 'blue' | 'red' | 'amber' | 'green' | 'purple' | 'pink' | 'teal'
         // Add -subtle suffix for light backgrounds
size: 'lg' | 'md' | 'sm'
```

**Visual representation:**
```tsx
<div className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-400 text-sm font-medium">
  Badge
</div>
```

## Input

```tsx
<div>
  <label className="text-gray-400 text-sm mb-2 block">Email</label>
  <div className="bg-background-100 border border-gray-400 rounded-md px-4 py-3 text-white">
    user@vercel.com
  </div>
</div>
```

## Checkbox

```tsx
import { Check } from '@geist-ui/icons';

// Checked
<div className="flex items-center gap-3">
  <div className="w-5 h-5 rounded border-2 border-green-700 bg-green-700 flex items-center justify-center">
    <Check size={12} color="white" />
  </div>
  <span className="text-white">Remember me</span>
</div>

// Unchecked
<div className="w-5 h-5 rounded border-2 border-gray-400" />
```

## Radio

```tsx
// Selected
<div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
</div>

// Unselected
<div className="w-5 h-5 rounded-full border-2 border-gray-400" />
```

## Toggle/Switch

```tsx
<div className="w-12 h-6 rounded-full bg-blue-500 flex items-center px-1">
  <div className="w-4 h-4 rounded-full bg-white" style={{ marginLeft: 'auto' }} />
</div>
```

## Select

```tsx
import { ChevronDown } from '@geist-ui/icons';

<div className="bg-background-100 border border-gray-400 rounded-md px-4 py-3 text-gray-400 flex justify-between items-center">
  <span>Select option...</span>
  <ChevronDown size={16} color="#737373" />
</div>
```

## Table

```tsx
<div className="border border-gray-400 rounded-lg overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="bg-background-200">
        <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium border-b border-gray-400">Column</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="px-4 py-3 text-white text-sm">data</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Tabs

```tsx
<div className="flex gap-1 bg-background-200 rounded-lg p-1">
  <div className="px-4 py-2 rounded-md bg-white text-black font-medium text-sm">Tab 1</div>
  <div className="px-4 py-2 rounded-md text-gray-400 text-sm">Tab 2</div>
  <div className="px-4 py-2 rounded-md text-gray-400 text-sm">Tab 3</div>
</div>
```

## Toast

```tsx
import { CheckCircle } from '@geist-ui/icons';

<div className="flex items-center gap-3 px-5 py-3 rounded-lg bg-background-200 border border-gray-400 shadow-lg">
  <CheckCircle size={18} color="#46A758" />  {/* Success = green */}
  <span className="text-white text-sm">Operation completed</span>
</div>
```

## StatusDot

```tsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-green-700" />  {/* Success = green */}
  <span className="text-gray-300 text-sm">Online</span>
</div>
```

## Spinner

```tsx
<div className="w-5 h-5 border-2 border-gray-600 border-t-blue-500 rounded-full" />
```
