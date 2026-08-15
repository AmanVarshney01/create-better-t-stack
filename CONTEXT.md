# Better T Stack

Better T Stack is a project scaffolding CLI that turns a stack selection into a reproducible TypeScript starter project.

## Language

**Project Configuration**:
A complete selection of stack choices used to scaffold one project.
_Avoid_: Config blob, options bag

**Core Stack**:
The primary framework and infrastructure choices that define the generated project's shape.
_Avoid_: Main options, basics

**Addon**:
An optional capability layered onto a generated project without changing the core stack identity.
_Avoid_: Plugin, extra

**Example**:
A generated sample feature included to demonstrate the selected stack.
_Avoid_: Demo, sample app

**Exhaustive Matrix**:
The set of all meaningful core-stack combinations after normalizing unordered selections.
_Avoid_: All permutations

**Addon Compatibility Coverage**:
Focused coverage proving addon rules, interactions, and representative generated output without crossing every addon subset through the exhaustive matrix.
_Avoid_: Addon exhaustive product

**Input Shape**:
The structural form of user-provided CLI input before it is normalized into a project configuration.
_Avoid_: Edge case, weird input

**Virtual Generation**:
Generation of the project tree in memory without writing the scaffolded project to disk.
_Avoid_: Dry run

**Filesystem Scaffolding**:
Creation of the generated project on disk.
_Avoid_: Real generation

**Curated Build Set**:
A small representative set of generated projects that are installed, typechecked, or built.
_Avoid_: Build every matrix case

**Compatibility Oracle**:
A test-owned model of which project configurations should be accepted or rejected.
_Avoid_: Validator reuse

**Matrix Job**:
A separately runnable test job that exercises large project-configuration matrices outside the default fast test suite.
_Avoid_: Normal test run

**Default Suite**:
The fast test suite that runs focused unit, integration, and regression tests during ordinary development.
_Avoid_: Main matrix

**Matrix Smoke**:
A representative matrix slice that runs in regular CI to catch broad compatibility regressions without running the full matrix.
_Avoid_: Mini exhaustive test

**Full Matrix Job**:
The sharded long-running matrix job that exercises the complete normalized core-stack matrix.
_Avoid_: Default tests

**Create Path**:
The CLI workflow that turns a project configuration into a new scaffolded project.
_Avoid_: Init path, generation path

**Add Path**:
The CLI workflow that adds capabilities to an existing Better T Stack project.
_Avoid_: Update path, addon install path

**MCP Surface**:
The Model Context Protocol server and tools that expose Better T Stack planning, creation, addon, guidance, and schema operations to agents.
_Avoid_: MCP addon

## Relationships

- A **Project Configuration** contains one **Core Stack**
- A **Project Configuration** may include zero or more **Addons**
- A **Project Configuration** may include zero or more **Examples**
- The **Exhaustive Matrix** covers **Core Stack** combinations
- **Addon Compatibility Coverage** covers addon-specific rules outside the exhaustive matrix
- **Input Shape** checks validate raw CLI input before project-configuration behavior is evaluated
- **Virtual Generation** and **Filesystem Scaffolding** are two ways to exercise project generation
- A **Curated Build Set** proves generated projects compile without building every matrix case
- A **Compatibility Oracle** predicts expected pass/fail before production validation runs
- A **Matrix Job** provides broad confidence without making the default test suite slow
- The **Default Suite**, **Matrix Smoke**, and **Full Matrix Job** are the three testing tiers
- The **Create Path** owns exhaustive project-configuration coverage
- The **Add Path** has a focused suite over existing-project state and addon behavior
- The **MCP Surface** is a critical CLI surface alongside the **Create Path** and **Add Path**
- The **MCP Surface** uses focused contract coverage instead of participating in the **Full Matrix Job**

## Example dialogue

> **Dev:** "Should the exhaustive tests include every order of addons?"
> **Domain expert:** "No. The **Exhaustive Matrix** covers normalized **Project Configurations**; addon ordering is an **Input Shape** concern."

## Flagged ambiguities

- "all possible combinations" was ambiguous between literal permutations and meaningful stack selections; resolved: use the **Exhaustive Matrix** for normalized core-stack combinations, with separate **Input Shape** tests for ordering, duplicates, and invalid `none` mixtures.
- "all addon combinations" was ambiguous between rule coverage and a full addon-subset product; resolved: use **Addon Compatibility Coverage** instead of crossing every addon subset through the **Exhaustive Matrix**.
- "all tests" was ambiguous between the default test suite and long-running exhaustive coverage; resolved: use a separate **Matrix Job** for broad matrix coverage.
- "test the MCP" was ambiguous between matrix participation and protocol contract coverage; resolved: the **MCP Surface** gets focused contract coverage.
- "complete CLI tests" was ambiguous between new-project creation and adding to existing projects; resolved: the **Create Path** gets exhaustive matrix coverage first, while the **Add Path** gets a focused complete suite.
