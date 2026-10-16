# Supabase CLI verification — 2026-10-16

The PR uses stable Supabase CLI **2.121.0** with the standard Docker-based local workflow. It does not enable experimental stacks or the native runtime.

The earlier six application runs used an experimental native runtime. Those runs do not validate the Docker workflow retained in this PR, and their results are withdrawn as evidence for this change. Experimental runtime integration, stack-specific cleanup and Git initialization changes have been removed.

## Verification scope

- `bun run check`, `bun run build:cli` (including publint), and CLI source/test typechecks passed.
- Full CLI suite: **871 passed, 65 skipped, 0 failed**.

- The actual pinned CLI successfully initialized a disposable project without enabling experimental stacks.
- Its `start --help` and `status --help` confirm the standard Docker commands and `status --output json` format.
- Starting the disposable project used the Docker path and reported that the local Docker daemon is unavailable.
- Regression tests cover Bun/npm/pnpm, split/fullstack environment files, existing Supabase configuration, manual setup, provider failures, malformed JSON and invalid database URLs. They assert that setup does not opt into experimental features.

Live Docker migrations, browser authentication and todo flows have not been rerun: the Docker daemon is unavailable on this machine. No experimental runtime is substituted for that missing prerequisite.

Sources: [Supabase local CLI guide](https://supabase.com/docs/guides/local-development/cli/getting-started), [runtime documentation](https://supabase.com/docs/guides/local-development/docker-and-native-runtimes).
