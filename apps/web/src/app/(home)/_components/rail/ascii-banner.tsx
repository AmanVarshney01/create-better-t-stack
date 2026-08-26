"use client";

import { useRef } from "react";

import { useFitText } from "./use-fit-text";

// ANSI Shadow, same face as the CLI banner in apps/cli/src/utils/render-title.ts.
// Two cuts: 72 columns for the rail, and a stacked 41-column one for phones,
// where 72 columns would render the glyphs too small to read. Divisors in
// .bts-banner / .bts-banner-narrow depend on those column counts.
const WIDE = `██████╗  ██████╗ ██╗     ██╗       ██╗   ██╗ ██████╗ ██╗   ██╗██████╗
██╔══██╗██╔═══██╗██║     ██║       ╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗
██████╔╝██║   ██║██║     ██║        ╚████╔╝ ██║   ██║██║   ██║██████╔╝
██╔══██╗██║   ██║██║     ██║         ╚██╔╝  ██║   ██║██║   ██║██╔══██╗
██║  ██║╚██████╔╝███████╗███████╗     ██║   ╚██████╔╝╚██████╔╝██║  ██║
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝     ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝

 ██████╗ ██╗    ██╗███╗   ██╗  ███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔═══██╗██║    ██║████╗  ██║  ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
██║   ██║██║ █╗ ██║██╔██╗ ██║  ███████╗   ██║   ███████║██║     █████╔╝
██║   ██║██║███╗██║██║╚██╗██║  ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
╚██████╔╝╚███╔███╔╝██║ ╚████║  ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
 ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝  ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`;

const NARROW = `██████╗  ██████╗ ██╗     ██╗
██╔══██╗██╔═══██╗██║     ██║
██████╔╝██║   ██║██║     ██║
██╔══██╗██║   ██║██║     ██║
██║  ██║╚██████╔╝███████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝

██╗   ██╗ ██████╗ ██╗   ██╗██████╗
╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗
 ╚████╔╝ ██║   ██║██║   ██║██████╔╝
  ╚██╔╝  ██║   ██║██║   ██║██╔══██╗
   ██║   ╚██████╔╝╚██████╔╝██║  ██║
   ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝

 ██████╗ ██╗    ██╗███╗   ██╗
██╔═══██╗██║    ██║████╗  ██║
██║   ██║██║ █╗ ██║██╔██╗ ██║
██║   ██║██║███╗██║██║╚██╗██║
╚██████╔╝╚███╔███╔╝██║ ╚████║
 ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝

███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
███████╗   ██║   ███████║██║     █████╔╝
╚════██║   ██║   ██╔══██║██║     ██╔═██╗
███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`;

export default function AsciiBanner() {
  const wideRef = useRef<HTMLPreElement>(null);
  const narrowRef = useRef<HTMLPreElement>(null);
  useFitText(wideRef);
  useFitText(narrowRef);

  return (
    <div className="bts-banner-fit">
      <pre ref={wideRef} aria-hidden="true" className="bts-banner max-md:hidden">
        {WIDE}
      </pre>
      <pre ref={narrowRef} aria-hidden="true" className="bts-banner-narrow md:hidden">
        {NARROW}
      </pre>
    </div>
  );
}
