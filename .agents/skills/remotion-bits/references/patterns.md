# Common Animation Patterns

## Table of Contents
- [Text Animations](#text-animations)
- [Particle Effects](#particle-effects)
- [Gradient Backgrounds](#gradient-backgrounds)
- [3D Scenes](#3d-scenes)
- [Responsive Design](#responsive-design)

---

## Text Animations

### Fade In Word by Word

```tsx
<AnimatedText
  transition={{
    split: "word",
    splitStagger: 3,
    opacity: [0, 1],
    y: [20, 0],
    duration: 30,
    easing: "easeOutCubic"
  }}
>
  Hello World
</AnimatedText>
```

### Character by Character with Scale

```tsx
<AnimatedText
  transition={{
    split: "character",
    splitStagger: 1,
    opacity: [0, 1],
    scale: [0.7, 1],
    y: [15, 0],
    duration: 10,
    easing: "easeOutCubic"
  }}
>
  Character Animation
</AnimatedText>
```

### Blur Slide Effect

```tsx
<AnimatedText
  transition={{
    split: "word",
    splitStagger: 2,
    opacity: [0, 1],
    blur: [10, 0],
    x: [-30, 0],
    duration: 20,
    easing: "easeOutCubic"
  }}
>
  Blur Slide Text
</AnimatedText>
```

### Cycling Text (Typewriter)

```tsx
<AnimatedText
  transition={{
    cycle: {
      texts: ["Building", "Creating", "Designing"],
      itemDuration: 60
    },
    opacity: [0, 1, 1, 0],
    duration: 60,
    easing: "easeInOutCubic"
  }}
/>
```

### TypeWriter Effect

```tsx
const rect = useViewportRect();

<TypeWriter
  text={[
    "Welcome to Remotion Bits",
    "Create amazing videos",
    "With elegant animations"
  ]}
  typeSpeed={3}
  deleteSpeed={2}
  pauseAfterType={30}
  deleteBeforeNext={true}
  errorRate={0.05}
  style={{ fontSize: rect.vmin * 5, color: "white" }}
/>
```

### Animated Counter

```tsx
<AnimatedCounter
  transition={{
    values: [0, 1000000],
    duration: 90,
    easing: "easeOutCubic",
    scale: [0.8, 1],
  }}
  prefix="$"
  toFixed={0}
  style={{ fontSize: 64, fontWeight: "bold" }}
/>

// Multiple keyframes
<AnimatedCounter
  transition={{
    values: [0, 100, 75, 150],
    duration: 120,
  }}
  postfix="%"
  toFixed={1}
/>
```

### Code Block Reveal

```tsx
const rect = useViewportRect();

<CodeBlock
  code={`function createVideo() {
  return <Composition
    id="MyVideo"
    component={MyComponent}
    durationInFrames={150}
    fps={30}
  />;
}`}
  language="tsx"
  theme="dark"
  showLineNumbers
  fontSize={rect.vmin * 2}
  highlight={[
    {
      lines: [2, 6],
      color: "rgba(59, 130, 246, 0.15)",
      opacity: [0, 1],
    },
  ]}
  transition={{
    lineStagger: 4,
    lineStaggerDirection: "forward",
    opacity: [0, 1],
    x: [-20, 0],
    duration: 20,
    easing: "easeOutCubic",
  }}
/>
```

### Matrix Rain Effect

```tsx
// Full screen matrix rain
<MatrixRain
  fontSize={18}
  color="#00FF00"
  speed={1.2}
  density={0.8}
  streamLength={20}
/>

// Slower, sparser effect
<MatrixRain
  fontSize={24}
  color="#00FFFF"
  speed={0.5}
  density={0.3}
  streamLength={15}
  charset="01"  // Binary only
/>
```

### Animated Counter

```tsx
<AnimatedCounter
  transition={{
    values: [0, 1000000],
    duration: 90,
    easing: "easeOutCubic",
    scale: [0.8, 1],
  }}
  prefix="$"
  toFixed={0}
  style={{ fontSize: 64, fontWeight: "bold" }}
/>

// Multiple keyframes
<AnimatedCounter
  transition={{
    values: [0, 100, 75, 150],
    duration: 120,
  }}
  postfix="%"
  toFixed={1}
/>
```

### Code Block Reveal

```tsx
const rect = useViewportRect();

<CodeBlock
  code={`function createVideo() {
  return <Composition
    id="MyVideo"
    component={MyComponent}
    durationInFrames={150}
    fps={30}
  />;
}`}
  language="tsx"
  theme="dark"
  showLineNumbers
  fontSize={rect.vmin * 2}
  highlight={[
    {
      lines: [2, 6],
      color: "rgba(59, 130, 246, 0.15)",
      opacity: [0, 1],
    },
  ]}
  transition={{
    lineStagger: 4,
    lineStaggerDirection: "forward",
    opacity: [0, 1],
    x: [-20, 0],
    duration: 20,
    easing: "easeOutCubic",
  }}
/>
```

### Matrix Rain Effect

```tsx
// Full screen matrix rain
<MatrixRain
  fontSize={18}
  color="#00FF00"
  speed={1.2}
  density={0.8}
  streamLength={20}
/>

// Slower, sparser effect
<MatrixRain
  fontSize={24}
  color="#00FFFF"
  speed={0.5}
  density={0.3}
  streamLength={15}
  charset="01"  // Binary only
/>
```

---

## Particle Effects

### Snow Effect

```tsx
const rect = useViewportRect();

<Particles startFrame={200}>
  <Spawner
    rate={1}
    lifespan={200}
    area={{ width: rect.width, height: 0 }}
    position={resolvePoint(rect, { x: "center", y: -200 })}
    transition={{ opacity: [0, 1] }}
  >
    {/* Multiple sizes for variety */}
    <div style={{
      width: rect.vmin * 1,
      height: rect.vmin * 1,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent 70%)"
    }} />
    <div style={{
      width: rect.vmin * 2,
      height: rect.vmin * 2,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(224,231,255,0.9), transparent 70%)"
    }} />
  </Spawner>
  <Behavior gravity={{ y: 0.1 }} />
  <Behavior wiggle={{ magnitude: 1, frequency: 0.5 }} />
</Particles>
```

### Fountain Effect

```tsx
const rect = useViewportRect();

<Particles>
  <Spawner
    rate={3}
    lifespan={100}
    position={resolvePoint(rect, { x: "center", y: rect.height })}
    velocity={{
      y: -15,
      varianceX: 3,
      varianceY: 2
    }}
  >
    <div style={{
      width: rect.vmin * 2,
      height: rect.vmin * 2,
      borderRadius: "50%",
      background: "#4f46e5"
    }} />
  </Spawner>
  <Behavior gravity={{ y: 0.3 }} />
  <Behavior opacity={[0, 1, 1, 0]} />
  <Behavior scale={{ start: 1, end: 0.3 }} />
</Particles>
```

### Flying Text Words

```tsx
const WORDS = ["React", "Remotion", "Animation"];
const rect = useViewportRect();

<Particles style={{ perspective: 5000 }}>
  <Spawner
    rate={0.2}
    lifespan={100}
    area={{ width: rect.width, height: rect.height, depth: -rect.vmin * 50 }}
    position={resolvePoint(rect, "center")}
    velocity={{ z: rect.vmin * 10, varianceZ: rect.vmin * 10 }}
  >
    {WORDS.map((word, i) => (
      <StaggeredMotion
        key={i}
        style={{ color: "white", fontSize: rect.vmin * 10 }}
        transition={{ opacity: [0, 1, 0.5, 0] }}
      >
        {word}
      </StaggeredMotion>
    ))}
  </Spawner>
</Particles>
```

---

## Gradient Backgrounds

### Linear Gradient Transition

```tsx
<GradientTransition
  gradient={[
    "linear-gradient(0deg, #051226, #1e0541)",
    "linear-gradient(180deg, #a5d4dd, #5674b1)"
  ]}
  duration={90}
  easing="easeInOut"
/>
```

### Radial Gradient Pulse

```tsx
<GradientTransition
  gradient={[
    "radial-gradient(circle at center, #ff6b6b, #4ecdc4)",
    "radial-gradient(circle at center, #4ecdc4, #ff6b6b)"
  ]}
  duration={60}
  easing="easeInOutSine"
/>
```

### Conic Gradient Rotation

```tsx
<GradientTransition
  gradient={[
    "conic-gradient(from 0deg, red, yellow, green, blue, red)",
    "conic-gradient(from 360deg, red, yellow, green, blue, red)"
  ]}
  duration={120}
  shortestAngle={false}  // Full rotation, not shortest path
/>
```

### Multi-Stop Transition

```tsx
<GradientTransition
  gradient={[
    "linear-gradient(45deg, #ff0000 0%, #ff7700 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)",
    "linear-gradient(225deg, #0000ff 0%, #00ff00 25%, #ffff00 50%, #ff7700 75%, #ff0000 100%)"
  ]}
  duration={120}
/>
```

### Scrolling Image Columns

```tsx
const rect = useViewportRect();

<ScrollingColumns
  columns={[
    {
      images: [
        "/photos/img1.jpg",
        "/photos/img2.jpg",
        "/photos/img3.jpg",
      ],
      speed: 100,
      direction: "up",
    },
    {
      images: [
        "/photos/img4.jpg",
        "/photos/img5.jpg",
        "/photos/img6.jpg",
      ],
      speed: 150,
      direction: "down",
    },
    {
      images: [
        "/photos/img7.jpg",
        "/photos/img8.jpg",
      ],
      speed: 80,
      direction: "up",
    },
  ]}
  height={rect.vmin * 40}
  gap={rect.vmin * 2}
  columnGap={rect.vmin * 3}
/>
```

---

## 3D Scenes

### Camera Transitions Between Steps

Steps define camera positions. The camera moves between them automatically:

```tsx
const rect = useViewportRect();
const fontSize = rect.vmin * 8;

<Scene3D
  perspective={1000}
  transitionDuration={50}
  stepDuration={50}
  easing="easeInOutCubic"
>
  <Step
    id="1"
    x={0}
    y={0}
    z={0}
    transition={{ opacity: [0, 1] }}
    exitTransition={{ opacity: [1, 0] }}
  >
    <h1 style={{ fontSize }}>Control</h1>
  </Step>
  <Step
    id="2"
    x={0}
    y={rect.vmin * 10}
    z={rect.vmin * 200}
    transition={{ opacity: [0, 1] }}
    exitTransition={{ opacity: [1, 0] }}
  >
    <h1 style={{ fontSize, background: 'white', color: 'black' }}>Camera</h1>
  </Step>
  <Step
    id="3"
    x={0}
    y={rect.vmin * 20}
    z={rect.vmin * 400}
    transition={{ opacity: [0, 1] }}
    exitTransition={{ opacity: [1, 0] }}
  >
    <h1 style={{ fontSize }}>Action</h1>
  </Step>
</Scene3D>
```

### 3D Elements with Staggered Animations

Place elements in 3D space and animate them independently:

```tsx
const rect = useViewportRect();

<Scene3D
  perspective={rect.width > 500 ? 1000 : 500}
  transitionDuration={20}
  stepDuration={20}
  easing="easeInOutCubic"
>
  {Array(20).fill(0).map((_, i) => {
    const x = randomFloat(`x-${i}`, -rect.width, rect.width * 2);
    const y = randomFloat(`y-${i}`, -rect.height, rect.height);
    const z = randomFloat(`z-${i}`, -rect.vmin * 200, rect.vmin * 20);

    return (
      <Element3D
        key={i}
        x={x}
        y={y}
        z={z}
        rotateZ={0.0001}
      >
        <StaggeredMotion
          transition={{
            opacity: [0, 0.2],
          }}
        >
          <div style={{
            width: rect.vmin * 2,
            height: rect.vmin * 2,
            borderRadius: "50%",
            background: `hsl(${randomFloat(`color-${i}`, 0, 360)}, 80%, 60%)`
          }} />
        </StaggeredMotion>
      </Element3D>
    );
  })}

  {/* Camera flies through positioned steps */}
  {["Fly", "Your", "Camera", "Through", "Space"].map((word, i) => (
    <Step
      key={i}
      x={i * rect.vmin * 50}
      y={0}
      z={0}
      rotateZ={-i * 15}
    >
      <h1 style={{ fontSize: rect.vmin * 8, color: 'white' }}>{word}</h1>
    </Step>
  ))}
</Scene3D>
```

### Step-Responsive Animations

```tsx
const rect = useViewportRect();

<Scene3D
  perspective={1000}
  transitionDuration={30}
  stepDuration={60}
>
  <Step id="intro" x={0} y={0} z={0} />
  <Step id="main" x={0} y={0} z={rect.vmin * 100} />
  <Step id="detail" x={rect.vmin * 50} y={0} z={rect.vmin * 200} />
  <Step id="outro" x={0} y={rect.vmin * 50} z={rect.vmin * 300} />

  {/* Element that responds to each step */}
  <StepResponsive
    steps={{
      intro: {
        x: -rect.width,
        opacity: 0,
        scale: 0.5
      },
      main: {
        x: 0,
        opacity: 1,
        scale: [1, 1.2, 1],  // Keyframes during this step
        rotateZ: [0, 10, -10, 0]
      },
      detail: {
        x: rect.vmin * 20,
        scale: 1.5,
        rotateY: 45
      },
      outro: {
        opacity: 0,
        scale: 0
      },
    }}
    transition={{
      duration: 25,
      easing: "easeInOutCubic"
    }}
  >
    <Element3D>
      <div style={{
        fontSize: rect.vmin * 8,
        color: "white",
        padding: rect.vmin * 3,
        background: "rgba(0,0,0,0.8)",
        borderRadius: rect.vmin * 2,
      }}>
        Step-Aware Content
      </div>
    </Element3D>
  </StepResponsive>

  {/* Another element with different step responses */}
  <StepResponsive
    steps={[
      { y: rect.height, opacity: 0 },           // step 0
      { y: rect.cy, opacity: 1 },               // step 1
      { y: rect.cy, opacity: 1, rotateZ: 360 }, // step 2
      { y: -rect.height, opacity: 0 },          // step 3
    ]}
    transition={{ duration: "step" }}  // Match step duration
  >
    <Element3D>
      <div style={{ fontSize: rect.vmin * 5, color: "cyan" }}>
        Following the camera
      </div>
    </Element3D>
  </StepResponsive>
</Scene3D>
```

---

## Responsive Design

### Using useViewportRect for Sizing

Always use viewport-relative units for responsive sizing:

```tsx
const rect = useViewportRect();

// Font sizes
<div style={{ fontSize: rect.vmin * 5 }}>Responsive text</div>

// Element sizes
<div style={{
  width: rect.vmin * 20,
  height: rect.vmin * 20,
  padding: rect.vmin * 2
}} />

// Positioning
<div style={{
  position: "absolute",
  left: rect.cx - (rect.vmin * 10),  // Centered horizontally
  top: rect.vh * 10                   // 10% from top
}} />
```

### Responsive Particle Sizes

```tsx
const rect = useViewportRect();

<Spawner rate={1} lifespan={100}>
  <div style={{
    width: rect.vmin * 3,   // 3% of smaller dimension
    height: rect.vmin * 3,
    borderRadius: "50%"
  }} />
</Spawner>
```

### Conditional Layout

```tsx
const rect = useViewportRect();
const isSmall = rect.width < 500;

<AnimatedText
  style={{ fontSize: isSmall ? rect.vmin * 8 : rect.vmin * 5 }}
  transition={{ ... }}
>
  Adaptive Text
</AnimatedText>
```

---

## Combining Components

### Text with Gradient Background

```tsx
<GradientTransition
  gradient={["linear-gradient(...)", "linear-gradient(...)"]}
  duration={90}
>
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  }}>
    <AnimatedText
      transition={{ split: "word", opacity: [0, 1], y: [30, 0], duration: 30 }}
      style={{ color: "white", fontSize: 48 }}
    >
      Text Over Gradient
    </AnimatedText>
  </div>
</GradientTransition>
```

### Particles with 3D Scene

```tsx
<Scene3D perspective={1000}>
  <Step z={0} />

  <Particles>
    <Spawner rate={2} lifespan={60} position={{ x: rect.cx, y: rect.cy }}>
      <div style={{ width: 10, height: 10, background: "white" }} />
    </Spawner>
    <Behavior gravity={{ y: 0.05 }} />
  </Particles>

  <Element3D x={rect.cx} y={rect.cy} z={0}>
    <AnimatedText transition={{ opacity: [0, 1], duration: 30 }}>
      3D Text with Particles
    </AnimatedText>
  </Element3D>
</Scene3D>
```

---

## Complex Scene Architecture

### Position Management Pattern

For multi-section presentations, pre-compute all positions in a `useMemo` tree:

```tsx
const positions = useMemo(() => {
  const { vmin } = rect;
  const base = Transform3D.identity();

  // Section bases — position each section in 3D space
  const elementsBase = base.translate(0, -vmin * 120, 0).rotateX(15);
  const transitionsBase = base.translate(vmin * 200, vmin * 50, 0).rotateY(-15);
  const scenesBase = base.translate(-vmin * 120, vmin * 70, 0).rotateY(15);

  // Derive card positions from section bases
  const cardW = vmin * 70;
  const cardH = vmin * 40;
  const row1Y = -cardH;
  const row2Y = 0;
  const row3Y = cardH;

  return {
    base,
    elements: {
      base: elementsBase,
      cards: {
        topLeft: elementsBase.translate(-cardW, row1Y, 0).rotateY(15).rotateX(10),
        topCenter: elementsBase.translate(0, row1Y - vmin * 10, vmin * 10).rotateX(10),
        topRight: elementsBase.translate(cardW, row1Y, 0).rotateY(-15).rotateX(10),
        midLeft: elementsBase.translate(-cardW, row2Y, vmin * 5).rotateY(15),
        midCenter: elementsBase.translate(0, row2Y, vmin * 10),
        midRight: elementsBase.translate(cardW, row2Y, vmin * 5).rotateY(-15),
      },
      title: elementsBase.translate(0, vmin * 10, 0),
    },
    transitions: {
      base: transitionsBase,
      title: transitionsBase,
    },
    scenes: {
      base: scenesBase,
      items: {
        hero: base.translate(vmin * 28, vmin * -5, vmin * 5).rotateY(-10),
        dash: base.translate(vmin * -80, vmin * -30, 0).rotateY(5),
      },
    },
  };
}, [rect.width, rect.height]);
```

### Step Mapping Helper

When multiple steps should share the same StepResponsive properties:

```tsx
const mapElementSteps = (props: StepResponsiveTransform) => ({
  'elements': props,
  'element-particles': props,
  'element-text': props,
  'element-counter': props,
  'element-code': props,
});

<StepResponsive
  centered
  style={{ fontSize: vmin * 10, position: 'absolute' }}
  steps={{
    'intro': { transform: [positions.elements.title] },
    ...mapElementSteps({ transform: [positions.elements.title] }), // Hold position
    'transitions': { transform: [positions.transitions.title] },    // Move to new section
  }}
>
  <h1>Elements</h1>
</StepResponsive>
```

### Multi-Element3D Scene Composition

Place multiple independently-animated elements within a Step:

```tsx
<Step id="scenes" duration={120} {...positions.scenes.base.toProps()}>
  {/* Each Element3D animates independently */}
  <Element3D centered
    style={{ width: vmin * 32, height: vmin * 24 }}
    transition={{
      delay: 10, opacity: [0, 1], duration: 35,
      transform: [
        positions.scenes.items.hero.translate(0, vmin * 20, 0), // Start below
        positions.scenes.items.hero,                              // End at position
      ],
      easing: 'easeInOutCubic',
    }}
  >
    <div style={{ background: 'linear-gradient(135deg, #FF9A9E, #FECFEF)',
      borderRadius: vmin * 1.5, width: '100%', height: '100%' }}>
      Hero Card
    </div>
  </Element3D>

  <Element3D centered
    style={{ width: vmin * 36, height: vmin * 16 }}
    transition={{
      delay: 20, opacity: [0, 1], duration: 35,
      transform: [
        positions.scenes.items.dash.translate(0, vmin * 15, 0),
        positions.scenes.items.dash,
      ],
      easing: 'easeInOutCubic',
    }}
  >
    <div>Dashboard Card</div>
  </Element3D>
</Step>
```

### Procedural Grid Generation

Generate dense visual grids with wave-based stagger timing:

```tsx
const gridData = useMemo(() => {
  const items = [];
  const rows = 10;
  const cols = 25;
  const size = 10 * vmin;
  const gap = 1 * vmin;
  const totalW = cols * size + (cols - 1) * gap;
  const totalH = rows * size + (rows - 1) * gap;

  const palette = ['#fb4934', '#b8bb26', '#fabd2f', '#83a598',
    '#d3869b', '#8ec07c', '#fe8019', '#d5c4a1'];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = `grid-${r}-${c}`;
      const cx = (cols - 1) / 2;
      const cy = (rows - 1) / 2;
      const dist = Math.sqrt(Math.pow(r - cy, 2) + Math.pow(c - cx, 2));
      const delay = 30 + dist * 2; // Wave from center

      const colorIndex = Math.floor(random(seed + 'color') * palette.length);

      items.push(
        <div key={`${r}-${c}`}
          style={{ position: 'absolute', left: c * (size + gap), top: r * (size + gap) }}>
          <StaggeredMotion transition={{
            opacity: [0, 1], scale: [0, 1],
            delay, duration: 40, easing: 'easeOutCubic',
          }}>
            <div style={{ width: size, height: size,
              background: palette[colorIndex], borderRadius: 4 }} />
          </StaggeredMotion>
        </div>
      );
    }
  }
  return { items, width: totalW, height: totalH };
}, [vmin]);

// Use in Scene3D:
<Step id="transitions" duration={120} {...transitionsPos.toProps()}>
  <Element3D centered style={{ width: gridData.width, height: gridData.height }}>
    {gridData.items}
  </Element3D>
</Step>
```

### Floating Card Component

Reusable frosted-glass card for showcasing features:

```tsx
const FloatingCard = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    position: 'relative',
    width: vmin * 60, height: vmin * 30,
    background: 'rgba(20, 20, 30, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: vmin * 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
  }}>
    {children}
  </div>
);
```
