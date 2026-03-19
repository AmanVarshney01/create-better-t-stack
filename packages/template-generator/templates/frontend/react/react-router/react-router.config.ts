import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  appDirectory: "src",
  future: {
    v8_middleware: true,
  },
} satisfies Config;
