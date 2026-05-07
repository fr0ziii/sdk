/** @jsxImportSource react */

/**
 * vargai init — local project setup for direct providers.
 *
 * Creates the project folders and a starter template that uses provider API keys
 * directly from the environment (for example FAL_API_KEY).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineCommand } from "citty";

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  dim: "\x1b[2m",
} as const;

const HELLO_TEMPLATE = `/** @jsxImportSource vargai */
import { Render, Clip, Image, Video } from "vargai/react";
import { fal } from "vargai/ai";

const character = Image({
  prompt: "friendly cinematic robot, blue metal, expressive eyes, studio lighting",
  model: fal.imageModel("flux-schnell"),
  aspectRatio: "9:16",
});

export default (
  <Render width={1080} height={1920}>
    <Clip duration={5}>
      <Video
        prompt={{
          text: "robot waves hello warmly, natural smile, subtle head movement, cinematic lighting",
          images: [character],
        }}
        model={fal.videoModel("kling-v2.5")}
      />
    </Clip>
  </Render>
);
`;

function logStep(message: string): void {
  console.log(`${COLORS.cyan}●${COLORS.reset} ${message}`);
}

function logSuccess(message: string): void {
  console.log(`${COLORS.green}✓${COLORS.reset} ${message}`);
}

function logInfo(message: string): void {
  console.log(`${COLORS.dim}• ${message}${COLORS.reset}`);
}

export function showInitHelp() {
  console.log(`
${COLORS.bold}vargai init${COLORS.reset}

initialize a project for direct provider usage.

${COLORS.bold}USAGE${COLORS.reset}
  vargai init [directory]

${COLORS.bold}EXAMPLES${COLORS.reset}
  ${COLORS.cyan}vargai init${COLORS.reset}              setup in current directory
  ${COLORS.cyan}vargai init my-project${COLORS.reset}   setup in my-project/

${COLORS.bold}WHAT IT DOES${COLORS.reset}
  1. Creates project structure (output/, .cache/ai/)
  2. Creates a hello.tsx starter template using fal directly
  3. Updates .gitignore
`);
}

export const initCmd = defineCommand({
  meta: {
    name: "init",
    description: "setup project for direct provider API keys",
  },
  args: {
    directory: {
      type: "positional",
      description: "project directory (default: current)",
      required: false,
    },
  },
  async run({ args }) {
    const dir = (args.directory as string) || ".";
    const cwd = dir === "." ? process.cwd() : join(process.cwd(), dir);

    console.log(`
${COLORS.bold}${COLORS.cyan}vargai${COLORS.reset}
${COLORS.bold}AI Video Generation Setup${COLORS.reset}
`);

    logStep("Setting up project structure");

    if (!existsSync(cwd) && dir !== ".") {
      mkdirSync(cwd, { recursive: true });
      logSuccess(`Created ${dir}/`);
    }

    for (const d of ["output", ".cache/ai"]) {
      const path = join(cwd, d);
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
        logSuccess(`Created ${d}/`);
      } else {
        logInfo(`${d}/ already exists`);
      }
    }

    logStep("Creating hello.tsx");

    const helloPath = join(cwd, "hello.tsx");
    if (!existsSync(helloPath)) {
      writeFileSync(helloPath, HELLO_TEMPLATE);
      logSuccess("Created hello.tsx");
    } else {
      logInfo("hello.tsx already exists");
    }

    logStep("Updating .gitignore");

    const gitignorePath = join(cwd, ".gitignore");
    const gitignoreEntries = [".env", ".cache/", "output/"];
    let gitignoreContent = existsSync(gitignorePath)
      ? readFileSync(gitignorePath, "utf8")
      : "";

    let added = false;
    for (const entry of gitignoreEntries) {
      if (!gitignoreContent.includes(entry)) {
        gitignoreContent += `\n${entry}`;
        added = true;
      }
    }

    if (added) {
      writeFileSync(gitignorePath, `${gitignoreContent.trim()}\n`);
      logSuccess("Updated .gitignore");
    } else {
      logInfo(".gitignore already configured");
    }

    console.log(`
${COLORS.green}${COLORS.bold}Setup complete!${COLORS.reset}

${COLORS.bold}Next steps:${COLORS.reset}
  1. Set direct provider keys in .env, for example:
     ${COLORS.cyan}FAL_API_KEY=fal_xxx${COLORS.reset}

  2. Render the starter template:
     ${COLORS.cyan}bunx vargai render hello.tsx${COLORS.reset}
`);
  },
});
