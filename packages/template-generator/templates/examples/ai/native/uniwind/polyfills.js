import structuredClone from "@ungap/structured-clone";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import("react-native/Libraries/Utilities/PolyfillFunctions");

    const { TextEncoderStream, TextDecoderStream } =
      await import("@stardazed/streams-text-encoding");

    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};
