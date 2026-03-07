# Components Reference

## Table of Contents
- [AnimatedText](#animatedtext)
- [AnimatedCounter](#animatedcounter)
- [TypeWriter](#typewriter)
- [CodeBlock](#codeblock)
- [MatrixRain](#matrixrain)
- [ScrollingColumns](#scrollingcolumns)
- [StaggeredMotion](#staggeredmotion)
- [GradientTransition](#gradienttransition)
- [Particle System](#particle-system)
- [Scene3D](#scene3d)
- [StepResponsive](#stepresponsive)

---

## AnimatedText

### Props

| Prop | Type | Description |
|------|------|-------------|
| `transition` | `AnimatedTextTransitionProps` | Animation configuration |
| `children` | `React.ReactNode` | Text content to animate |
| `className` | `string?` | CSS class names |
| `style` | `React.CSSProperties?` | Inline styles |

### Transition Props

**Text-specific:**
- `split`: `"none" | "word" | "character" | "line" | string` - Split mode or custom separator
- `splitStagger`: `number` - Frames between each split unit (default: 0)
- `cycle`: `{ texts: string[]; itemDuration: number }` - Cycle through text array

**Transform properties (all accept AnimatedValue):**
- `x`, `y`, `z` - Translation in pixels
- `scale`, `scaleX`, `scaleY` - Scale factor
- `rotate`, `rotateX`, `rotateY`, `rotateZ` - Rotation in degrees
- `skew`, `skewX`, `skewY` - Skew in degrees

**Visual properties:**
- `opacity`: `AnimatedValue` - 0 to 1
- `color`: `string[]` - Array of CSS colors to interpolate
- `backgroundColor`: `string[]` - Array of CSS colors
- `blur`: `AnimatedValue` - Blur in pixels

**Timing:**
- `frames`: `[number, number]` - Start and end frame
- `duration`: `number` - Duration in frames (alternative to frames)
- `delay`: `number` - Delay before animation starts
- `easing`: `EasingName | EasingFunction` - Easing curve

---

## AnimatedCounter

Counter component that interpolates between numeric values with optional prefix/postfix.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `transition` | `AnimatedCounterTransitionProps` | required | Animation configuration |
| `prefix` | `React.ReactNode` | | Content before the number |
| `postfix` | `React.ReactNode` | | Content after the number |
| `toFixed` | `number` | `0` | Decimal places to display |
| `className` | `string?` | | CSS class names |
| `style` | `React.CSSProperties?` | | Inline styles |

### Transition Props

Inherits all transform, visual, and timing props from AnimatedText, plus:

- `values`: `AnimatedValue` - Number or array of numbers to interpolate

### Example

```tsx
<AnimatedCounter
  transition={{
    values: [0, 100],
    duration: 60,
    easing: "easeOutCubic"
  }}
  toFixed={0}
  prefix="$"
  style={{ fontSize: 48 }}
/>
```

---

## TypeWriter

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string | string[]` | required | Text(s) to type |
| `typeSpeed` | `AnimatedValue` | `3` | Frames per character |
| `deleteSpeed` | `AnimatedValue` | `2` | Frames per backspace |
| `pauseAfterType` | `number` | `30` | Frames to wait after typing |
| `pauseAfterDelete` | `number` | `15` | Frames to wait after deleting |
| `loop` | `boolean` | `false` | Loop sequence |
| `deleteBeforeNext` | `boolean` | `true` | Delete text before next item |
| `cursor` | `boolean | ReactNode` | `true` | Show cursor |
| `blinkSpeed` | `number` | `30` | Cursor blink rate |
| `errorRate` | `number` | `0` | Probability of typo (0-1) |
| `errorCorrectDelay` | `number` | `5` | Frames to pause on error |
| `transition` | `TypeWriterTransitionProps` | | Motion transition |

### Transition Props

Inherits all transform, visual, and timing props from AnimatedText.

---

## CodeBlock

Syntax-highlighted code block with line-by-line reveal, highlighting, and focus animations.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | required | Code to display |
| `language` | `string` | `"tsx"` | Syntax highlighting language |
| `theme` | `"dark" | "light" | "custom"` | `"dark"` | Color theme |
| `customTheme` | `any` | | Custom prism theme object |
| `highlight` | `HighlightRegion[]` | | Lines to highlight |
| `focus` | `FocusRegion` | | Lines to focus (dims others) |
| `transition` | `CodeBlockTransition` | | Line reveal animation |
| `showLineNumbers` | `boolean` | `false` | Show line numbers |
| `lineNumberColor` | `string` | `"#666"` | Line number color |
| `fontSize` | `number` | auto | Font size (responsive) |
| `lineHeight` | `number` | `1.5` | Line height multiplier |
| `padding` | `number` | auto | Container padding |
| `className` | `string?` | | CSS class names |
| `style` | `React.CSSProperties?` | | Inline styles |

### Highlight/Focus Region

```ts
type HighlightRegion = {
  lines: number | [number, number];  // Line or range
  color?: string;                     // Background color
  opacity?: AnimatedValue;            // Highlight opacity
  blur?: AnimatedValue;               // Blur effect
};

type FocusRegion = {
  lines: number | [number, number];
  dimOpacity?: number;                // Opacity of unfocused lines
  dimBlur?: number;                   // Blur of unfocused lines
};
```

### Transition Props

- `lineStagger`: `number` - Frames between each line reveal
- `lineStaggerDirection`: `"forward" | "reverse" | "center" | "random"` - Reveal order
- `duration`: `number` - Duration per line
- `delay`: `number` - Initial delay
- `easing`: `EasingName | EasingFunction` - Easing curve
- Inherits transform and visual props from AnimatedText

### Example

```tsx
<CodeBlock
  code={`function hello() {
  console.log("Hello World");
}`}
  language="typescript"
  showLineNumbers
  highlight={[
    { lines: 2, color: "rgba(255,255,0,0.2)", opacity: [0, 1] }
  ]}
  transition={{
    lineStagger: 5,
    opacity: [0, 1],
    x: [-20, 0],
    duration: 15
  }}
/>
```

---

## MatrixRain

Matrix-style digital rain effect with configurable characters, density, and speed.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fontSize` | `number` | `20` | Character size in pixels |
| `color` | `string` | `"#00FF00"` | Rain color |
| `speed` | `number` | `1` | Speed multiplier |
| `density` | `number` | `1` | Column density (0-1) |
| `streamLength` | `number` | `20` | Characters per stream |
| `charset` | `string` | alphanumeric | Characters to display |

### Example

```tsx
<MatrixRain
  fontSize={16}
  color="#00FF00"
  speed={1.5}
  density={0.7}
  streamLength={25}
/>
```

---

## ScrollingColumns

Infinitely scrolling columns of images with configurable speed and direction.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ScrollingColumnConfig[]` | required | Column configurations |
| `height` | `number | string` | `300` | Image height |
| `width` | `number | string` | `"100%"` | Column width |
| `gap` | `number` | `20` | Gap between images |
| `columnGap` | `number` | `20` | Gap between columns |
| `imageStyle` | `React.CSSProperties?` | | Styles for images |
| `className` | `string?` | | CSS class names |
| `style` | `React.CSSProperties?` | | Inline styles |

### ScrollingColumnConfig

```ts
type ScrollingColumnConfig = {
  images: string[];              // Array of image URLs
  speed?: number;                // Scroll speed in pixels/second
  direction?: "up" | "down";    // Scroll direction
};
```

### Example

```tsx
<ScrollingColumns
  columns={[
    {
      images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
      speed: 100,
      direction: "up"
    },
    {
      images: ["/img4.jpg", "/img5.jpg"],
      speed: 150,
      direction: "down"
    }
  ]}
  height={400}
  gap={15}
/>
```

---

## StaggeredMotion

### Props

| Prop | Type | Description |
|------|------|-------------|
| `transition` | `StaggeredMotionTransitionProps` | Animation configuration |
| `children` | `React.ReactNode` | Child elements to animate |
| `className` | `string?` | CSS class names |
| `style` | `React.CSSProperties?` | Inline styles |
| `cycleOffset` | `number?` | Override frame for relative animations |

### Transition Props

Inherits all transform, visual, and timing props from AnimatedText, plus:

- `stagger`: `number` - Frames between each child (default: 0)
- `staggerDirection`: `"forward" | "reverse" | "center" | "random"` - Animation order

---

## GradientTransition

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gradient` | `string[]` | required | CSS gradient strings to transition |
| `frames` | `[number, number]?` | `[0, duration]` | Frame range |
| `duration` | `number?` | composition duration | Duration in frames |
| `delay` | `number?` | `0` | Start frame |
| `easing` | `EasingName | EasingFunction?` | `"linear"` | Easing curve |
| `shortestAngle` | `boolean?` | `true` | Interpolate angles via shortest path |
| `className` | `string?` | | CSS class names |
| `style` | `React.CSSProperties?` | | Inline styles |
| `children` | `React.ReactNode?` | | Content on top of gradient |

### Supported Gradient Types
- `linear-gradient(angle, color1, color2, ...)`
- `radial-gradient(shape at position, color1, color2, ...)`
- `conic-gradient(from angle at position, color1, color2, ...)`

---

## Particle System

### Particles

Container component that runs the simulation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `startFrame` | `number?` | `0` | Pre-simulate this many frames |
| `children` | `React.ReactNode` | | Spawner and Behavior components |
| `style` | `React.CSSProperties?` | | Container styles |
| `className` | `string?` | | CSS class names |

### Spawner

Defines particle emission source.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string?` | auto-generated | Unique spawner ID |
| `rate` | `number` | required | Particles per frame |
| `burst` | `number?` | | Particles to emit on first frame |
| `max` | `number?` | | Max active particles |
| `lifespan` | `number` | required | Frames each particle lives |
| `startFrame` | `number?` | `0` | Frame offset for this spawner |
| `position` | `Point?` | `{x:0, y:0}` | Spawn position |
| `area` | `{width, height, depth?}?` | | Spawn area size |
| `velocity` | `VelocityConfig?` | | Initial velocity |
| `transition` | `TransitionProps?` | | Animation applied to each particle |
| `children` | `React.ReactNode` | | Particle visual(s) |

**VelocityConfig:**
```ts
{
  x?: number; y?: number; z?: number;
  varianceX?: number; varianceY?: number; varianceZ?: number;
}
```

### Behavior

Defines physics and property changes.

| Prop | Type | Description |
|------|------|-------------|
| `gravity` | `{x?, y?, z?, varianceX?, varianceY?, varianceZ?}` | Force vector |
| `drag` | `number` | Air resistance (0-1, where 1 = no drag) |
| `dragVariance` | `number` | Random variation in drag |
| `wiggle` | `{magnitude, frequency, variance?}` | Random movement |
| `scale` | `{start, end, startVariance?, endVariance?}` | Scale over life |
| `opacity` | `number[]` | Opacity keyframes over life |
| `handler` | `(particle) => void` | Custom particle modifier |

---

## Scene3D

### Scene3D

Container for 3D scene with camera.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `perspective` | `number?` | `1000` | CSS perspective in pixels |
| `transitionDuration` | `number?` | `30` | Frames for camera transitions |
| `easing` | `EasingName | EasingFunction?` | `"easeInOutCubic"` | Transition easing |
| `activeStep` | `string?` | | Force specific step by ID |
| `stepDuration` | `number?` | auto | Duration per step in frames |
| `width` | `number?` | video width | Design width |
| `height` | `number?` | video height | Design height |
| `children` | `React.ReactNode` | | Step and Element3D components |

### Step

Defines a camera position/target. Children are visible when this step is active.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string?` | auto-generated | Step identifier (used by StepResponsive) |
| `duration` | `number?` | auto | Override duration for this step in frames |
| `x`, `y`, `z` | `AnimatedValue?` | `0` | Camera target position |
| `scale`, `scaleX`, `scaleY` | `AnimatedValue?` | `1` | Camera zoom |
| `rotateX`, `rotateY`, `rotateZ` | `AnimatedValue?` | `0` | Camera rotation (degrees) |
| `rotateOrder` | `"xyz" | "xzy" | "yxz" | ...` | `"xyz"` | Rotation order |
| `transition` | `TransitionConfig?` | | Animate children on step entry |
| `exitTransition` | `TransitionConfig?` | | Animate children on step exit |
| `className` | `string?` | | CSS class names |
| `style` | `React.CSSProperties?` | | Inline styles |
| `children` | `React.ReactNode?` | | Content visible during step |

**Using Transform3D with Step:**
```tsx
const pos = Transform3D.identity().translate(vmin * 50, 0, 0).rotateY(-15);
<Step id="my-step" {...pos.toProps()} />
```

**Entry/Exit transitions:**
```tsx
<Step id="demo" {...pos.toProps()}
  transition={{ opacity: [0, 1], blur: [10, 0] }}
  exitTransition={{ opacity: [1, 0], blur: [0, 10] }}
>
  <div>Fades in when camera arrives, fades out when camera leaves</div>
</Step>
```

### Element3D

Positions content in 3D space, independent of camera movement.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `x`, `y`, `z` | `AnimatedValue?` | `0` | Position in 3D space |
| `scale`, `scaleX`, `scaleY` | `AnimatedValue?` | `1` | Scale |
| `rotateX`, `rotateY`, `rotateZ` | `AnimatedValue?` | `0` | Rotation (degrees) |
| `centered` | `boolean?` | `false` | Center the element (translate(-50%, -50%)) |
| `fixed` | `boolean?` | `false` | Fixed to viewport (not affected by camera) |
| `transition` | `TransitionConfig?` | | Animate on mount |
| `children` | `React.ReactNode` | | Content to position |
| `className` | `string?` | | CSS class names |
| `style` | `React.CSSProperties?` | | Additional styles |

**TransitionConfig** supports all transform and visual props (x, y, z, scale, rotate*, opacity, blur, color, etc.) plus:
- `transform`: `AnimatedValue<Transform3D | Matrix4>` — 3D transform keyframes
- `stagger`: `number` — frames between each child
- `staggerDirection`: `"forward" | "reverse" | "center" | "random"`

**Example with Transform3D keyframes:**
```tsx
const start = base.translate(0, vmin * 20, 0);
const end = base.translate(0, 0, 0);

<Element3D centered
  style={{ width: vmin * 32, height: vmin * 24 }}
  transition={{
    delay: 10, opacity: [0, 1], duration: 35,
    transform: [start, end],
    easing: 'easeInOutCubic',
  }}
>
  <div>Slides up into place</div>
</Element3D>
```

### Hooks

- `useScene3D()` - Returns `{ camera, activeStepId, registerStep, steps }`
- `useCamera()` - Returns current camera state
- `useActiveStep()` - Returns currently active step ID

---

## StepResponsive

Wrapper component that animates elements based on the active Scene3D step. Enables step-aware responsive transforms with property inheritance.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepResponsiveMap` | required | Step-specific transforms |
| `transition` | `StepResponsiveTransition?` | | Transition configuration |
| `defaultProps` | `StepResponsiveTransform?` | `{}` | Default transform values |
| `animate` | `boolean?` | `true` | Enable animations |
| `centered` | `boolean?` | `false` | Center child element |
| `style` | `React.CSSProperties?` | | Additional styles |
| `children` | `React.ReactElement` | required | Single React element to wrap |

### StepResponsiveMap

Can be an array (indexed by step) or object (keyed by step ID or range):

```ts
// Array format (by index)
steps={[
  { x: 0, opacity: 1 },      // step 0
  { x: 100, opacity: 0.5 },  // step 1
]}

// Object format (by ID)
steps={{
  "step-0": { x: 0, opacity: 1 },
  "step-1": { x: 100, opacity: 0.5 },
}}

// Range format
steps={{
  "step-0..step-2": { x: 0 },  // steps 0-2
  "step-3": { x: 100 },         // step 3 only
}}
```

### StepResponsiveTransform

Supports all Transform3D properties:
- `x`, `y`, `z` - Position (AnimatedValue)
- `scale`, `scaleX`, `scaleY` - Scale (AnimatedValue)
- `rotateX`, `rotateY`, `rotateZ` - Rotation (AnimatedValue)
- `opacity` - Opacity (AnimatedValue)
- `color`, `backgroundColor` - Colors (string[])
- `transform` - `AnimatedValue<Transform3D | Matrix4>` — 3D transform keyframes (primary method for 3D positioning)
- `duration` - Override transition duration (`number` or `"step"` to match step duration)
- `delay` - Delay before animation
- `easing` - Easing function

**Property inheritance:** Properties accumulate across steps. If step "main" sets opacity to 1 and step "outro" doesn't mention opacity, it stays at 1. Array values flatten to their final value when transitioning to the next step.

**Transform3D keyframes:** The `transform` property is the primary way to position elements in 3D space when using StepResponsive. Pass an array of `Transform3D` instances:
```tsx
steps={{
  'intro': { transform: [startPos, endPos] },           // Animate between
  'main': { transform: [holdPos] },                      // Hold position
  'outro': { transform: [holdPos, exitPos], duration: "step" },  // Animate out
}}
```

### Transition Props

```ts
type StepResponsiveTransition = {
  duration?: number | "step";  // Frames or match step duration
  delay?: number;              // Delay in frames
  easing?: EasingName | EasingFunction;
};
```

### Example

```tsx
<Scene3D>
  <Step id="intro" />
  <Step id="main" />
  <Step id="outro" />

  <StepResponsive
    steps={{
      intro: { x: -200, opacity: 0 },
      main: { x: 0, opacity: 1, scale: [1, 1.2, 1] },
      outro: { x: 200, opacity: 0 },
    }}
    transition={{ duration: 30, easing: "easeInOutCubic" }}
  >
    <Element3D>
      <h1>Responsive to Steps</h1>
    </Element3D>
  </StepResponsive>
</Scene3D>
```

### useStepResponsive Hook

For more control, use the hook version:

```tsx
import { useStepResponsive } from "remotion-bits";

function MyElement() {
  const style = useStepResponsive({
    "step-0": { x: 0, opacity: 1 },
    "step-1": { x: 100, opacity: 0.5 },
  }, {
    duration: 20,
    easing: "easeOutCubic"
  });

  return <div style={style}>Content</div>;
}
```
