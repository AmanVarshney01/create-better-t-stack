---
name: visual-elements
description: Device mockups, typography, and visual components
---

# Visual Elements

## Device Mockups

### iPhone Mockup

```tsx
const PhoneMockup: React.FC<{
  children: React.ReactNode;
  scale?: number;
}> = ({ children, scale = 1 }) => {
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        position: "relative",
        width: 280,
        height: 580,
        borderRadius: 40,
        backgroundColor: "#000",
        padding: 8,
        boxShadow: "0 50px 100px rgba(0,0,0,0.4)",
      }}
    >
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 100,
          height: 28,
          backgroundColor: "#000",
          borderRadius: 20,
          zIndex: 10,
        }}
      />
      {/* Screen */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 32,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};
```

### Browser Mockup

```tsx
const BrowserMockup: React.FC<{
  children: React.ReactNode;
  url?: string;
}> = ({ children, url = "yourapp.com" }) => {
  return (
    <div
      style={{
        width: 900,
        borderRadius: 12,
        backgroundColor: "#1a1a1a",
        boxShadow: "0 50px 100px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: 40,
          backgroundColor: "#2a2a2a",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
        }}
      >
        {/* Traffic lights */}
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
        {/* URL bar */}
        <div
          style={{
            flex: 1,
            height: 24,
            backgroundColor: "#1a1a1a",
            borderRadius: 6,
            marginLeft: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {url}
        </div>
      </div>
      {/* Content */}
      <div style={{ aspectRatio: "16/10" }}>
        {children}
      </div>
    </div>
  );
};
```

## Screenshot Requirements

### Resolution
```
Mobile: 750 x 1624 (iPhone 14 Pro)
Desktop: 2560 x 1600 (MacBook)
```

Always use **2x resolution** for crisp display.

### Preparation
1. Clean up notifications
2. Use realistic but professional data
3. Highlight the key feature
4. Consistent color mode (dark/light)

### Loading into Remotion

```tsx
import { Img, staticFile } from "remotion";

<Img
  src={staticFile("screenshot.png")}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
/>
```

## Typography Components

### Headline

```tsx
const Headline: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        fontFamily,
        fontSize: 64,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: -1,
        lineHeight: 1.1,
      }}
    >
      {children}
    </div>
  );
};
```

### Subheadline

```tsx
const Subheadline: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        fontFamily,
        fontSize: 24,
        fontWeight: 400,
        color: "rgba(255,255,255,0.6)",
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
};
```

## Feature Indicators

### Numbered List

```tsx
const FeatureItem: React.FC<{
  number: string;
  title: string;
  description: string;
}> = ({ number, title, description }) => {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div
        style={{
          fontFamily,
          fontSize: 14,
          fontWeight: 500,
          color: "#4ade80",
          backgroundColor: "rgba(74, 222, 128, 0.1)",
          padding: "6px 12px",
          borderRadius: 20,
        }}
      >
        {number}
      </div>
      <div>
        <div style={{ fontFamily, fontSize: 20, fontWeight: 700, color: "#fff" }}>
          {title}
        </div>
        <div style={{ fontFamily, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
          {description}
        </div>
      </div>
    </div>
  );
};
```

## CTA Elements

### URL Button

```tsx
const UrlButton: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div
      style={{
        fontFamily,
        fontSize: 20,
        fontWeight: 500,
        color: "#0a0a0a",
        backgroundColor: "#fff",
        padding: "16px 48px",
        borderRadius: 50,
      }}
    >
      {url}
    </div>
  );
};
```

### QR Code (optional)

For videos that will be shown on large screens:

```tsx
// Use a QR code library or static image
<Img
  src={staticFile("qr-code.png")}
  style={{ width: 100, height: 100 }}
/>
```

## Layout Patterns

### Split Screen (Text + Device)

```tsx
<AbsoluteFill
  style={{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 80,
    padding: "0 100px",
  }}
>
  <div style={{ maxWidth: 500 }}>
    {/* Text content */}
  </div>
  <div>
    {/* Device mockup */}
  </div>
</AbsoluteFill>
```

### Centered (Single Focus)

```tsx
<AbsoluteFill
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  }}
>
  {/* Content */}
</AbsoluteFill>
```
