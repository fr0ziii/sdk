<p align="center">
  <h1 align="center">varg — AI Video Generation SDK</h1>
  <p align="center">Create AI videos with JSX. One SDK for Kling, Flux, ElevenLabs, Sora and more. Built on Vercel AI SDK.</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vargai"><img src="https://img.shields.io/npm/v/vargai.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/vargai"><img src="https://img.shields.io/npm/dm/vargai.svg" alt="npm downloads"></a>
  <a href="https://github.com/vargHQ/sdk/stargazers"><img src="https://img.shields.io/github/stars/vargHQ/sdk" alt="GitHub stars"></a>
  <a href="https://github.com/vargHQ/sdk/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-Apache--2.0-blue" alt="License"></a>
</p>

---

**varg** is an open-source TypeScript SDK for AI video generation. It uses direct provider API keys for images, video, speech, music, lipsync, and captions. Write videos as JSX components (like React), render locally or with your chosen FFmpeg backend.

## Get started

### For AI agents (recommended)

Set direct provider keys, then ask your agent to write declarative JSX.

```bash
export FAL_API_KEY=fal_xxx
export ELEVENLABS_API_KEY=el_xxx

claude "create a 10-second product video for white sneakers, 9:16, UGC style, with captions and background music"
```

The agent writes declarative JSX; the SDK handles generation, caching, and rendering.

### For developers

```bash
# Install with bun (recommended)
bun install vargai ai

# Or with npm
npm install vargai ai

# Set up project (hello.tsx, output/, cache dirs)
bunx vargai init
```

`vargai init` creates a starter template and local project structure.

Then render the starter template:

```bash
bunx vargai render hello.tsx
```

Or ask your AI agent to create something from scratch.

## How it works

```
Your prompt / JSX code
        |
 Direct provider SDKs / APIs
   /     |      \        \
 Kling  Flux  ElevenLabs  Wan ...   (AI providers)
   \     |      /        /
    local render engine
        |
   output.mp4
```

- **Direct provider keys** keep API calls under your own provider accounts
- **Declarative JSX** — compose videos like React components with `<Clip>`, `<Video>`, `<Music>`, `<Captions>`
- **Automatic caching** — same props = instant cache hit at $0. Re-render without re-generating
- **Local or custom backend** — render with `bunx vargai render` or provide your own FFmpeg backend

## Quick examples

### Image to video

```tsx
import { Render, Clip, Image, Video } from "vargai/react";
import { fal, elevenlabs } from "vargai/ai";

const character = Image({
  prompt: "cute kawaii orange cat, round body, big eyes, Pixar style",
  model: fal.imageModel("nano-banana-pro"),
  aspectRatio: "9:16",
});

export default (
  <Render width={1080} height={1920}>
    <Clip duration={5}>
      <Video
        prompt={{ text: "cat waves hello, bounces happily", images: [character] }}
        model={fal.videoModel("kling-v3")}
      />
    </Clip>
  </Render>
);
```

```bash
bunx vargai render hello.tsx
```

### With music and captions

```tsx
import { Render, Clip, Image, Video, Speech, Captions, Music } from "vargai/react";
import { fal, elevenlabs } from "vargai/ai";

const character = Image({
  model: fal.imageModel("nano-banana-pro"),
  prompt: "friendly robot, blue metallic, expressive eyes",
  aspectRatio: "9:16",
});

const voiceover = Speech({
  model: elevenlabs.speechModel("eleven_v3"),
  voice: "adam",
  children: "Hello! I'm your AI assistant. Let me show you something cool!",
});

export default (
  <Render width={1080} height={1920}>
    <Music prompt="upbeat electronic, cheerful" model={elevenlabs.musicModel()} volume={0.15} />
    <Clip duration={5}>
      <Video
        prompt={{ text: "robot talking, subtle head movements", images: [character] }}
        model={fal.videoModel("kling-v3")}
      />
    </Clip>
    <Captions src={voiceover} style="tiktok" color="#ffffff" withAudio />
  </Render>
);
```

### Talking head with lipsync

```tsx
import { Render, Clip, Image, Video, Speech, Captions, Music } from "vargai/react";
import { fal, elevenlabs } from "vargai/ai";

const voiceover = Speech({
  model: elevenlabs.speechModel("eleven_v3"),
  voice: "josh",
  children: "With varg, you can create any videos at scale!",
});

const baseCharacter = Image({
  prompt: "woman, sleek black bob hair, fitted black t-shirt, natural look",
  model: fal.imageModel("nano-banana-pro"),
  aspectRatio: "9:16",
});

const animatedCharacter = Video({
  prompt: {
    text: "woman speaking naturally, subtle head movements, friendly expression",
    images: [baseCharacter],
  },
  model: fal.videoModel("kling-v3"),
});

export default (
  <Render width={1080} height={1920}>
    <Music prompt="modern tech ambient, subtle electronic" model={elevenlabs.musicModel()} volume={0.1} />
    <Clip duration={5}>
      <Video
        prompt={{ video: animatedCharacter, audio: voiceover }}
        model={fal.videoModel("sync-v2-pro")}
      />
    </Clip>
    <Captions src={voiceover} style="tiktok" color="#ffffff" withAudio />
  </Render>
);
```

## Components

| Component | Purpose | Key props |
|-----------|---------|-----------|
| `<Render>` | Root container | `width`, `height`, `fps` |
| `<Clip>` | Time segment | `duration`, `transition`, `cutFrom`, `cutTo` |
| `<Image>` | AI or static image | `prompt`, `src`, `model`, `zoom`, `aspectRatio`, `resize` |
| `<Video>` | AI or source video | `prompt`, `src`, `model`, `volume`, `cutFrom`, `cutTo` |
| `<Speech>` | Text-to-speech | `voice`, `model`, `volume`, `children` |
| `<Music>` | Background music | `prompt`, `src`, `model`, `volume`, `loop`, `ducking` |
| `<Title>` | Text overlay | `position`, `color`, `start`, `end` |
| `<Subtitle>` | Subtitle text | `backgroundColor` |
| `<Captions>` | Auto-generated subs | `src`, `srt`, `style`, `color`, `activeColor`, `withAudio` |
| `<Overlay>` | Positioned layer | `left`, `top`, `width`, `height`, `keepAudio` |
| `<Split>` | Side-by-side | `direction` |
| `<Slider>` | Before/after reveal | `direction` |
| `<Swipe>` | Tinder-style cards | `direction`, `interval` |
| `<TalkingHead>` | Animated character | `character`, `src`, `voice`, `model`, `lipsyncModel` |
| `<Packshot>` | End card with CTA | `background`, `logo`, `cta`, `blinkCta` |

### Caption styles

```tsx
<Captions src={voiceover} style="tiktok" />     // word-by-word highlight
<Captions src={voiceover} style="karaoke" />    // fill left-to-right
<Captions src={voiceover} style="bounce" />     // words bounce in
<Captions src={voiceover} style="typewriter" /> // typing effect
```

### Transitions

67 GL transitions available:

```tsx
<Clip transition={{ name: "fade", duration: 0.5 }}>
<Clip transition={{ name: "crossfade", duration: 0.5 }}>
<Clip transition={{ name: "wipeleft", duration: 0.5 }}>
<Clip transition={{ name: "cube", duration: 0.8 }}>
```

## Models

Models are accessed through direct providers.

```typescript
import { fal, elevenlabs, groq } from "vargai/ai";
```

### Video

| Model | Use case | Cost (5s) |
|-------|----------|-------------|
| `fal.videoModel("kling-v3")` | Best quality, latest | provider-priced |
| `fal.videoModel("kling-v3-standard")` | Good quality, cheaper | provider-priced |
| `fal.videoModel("kling-v2.5")` | Previous gen, reliable | provider-priced |
| `fal.videoModel("wan-2.5")` | Good for characters | provider-priced |
| `fal.videoModel("minimax")` | Alternative | provider-priced |
| `fal.videoModel("sync-v2-pro")` | Lipsync (video + audio) | provider-priced |

### Image

| Model | Use case | Cost |
|-------|----------|---------|
| `fal.imageModel("nano-banana-pro")` | Versatile, fast | provider-priced |
| `fal.imageModel("nano-banana-pro/edit")` | Image-to-image editing | provider-priced |
| `fal.imageModel("flux-schnell")` | Fast generation | provider-priced |
| `fal.imageModel("flux-pro")` | High quality | provider-priced |
| `fal.imageModel("recraft-v3")` | Alternative | provider-priced |

### Audio

| Model | Use case | Cost |
|-------|----------|---------|
| `elevenlabs.speechModel("eleven_v3")` | Text-to-speech | provider-priced |
| `elevenlabs.speechModel("eleven_multilingual_v2")` | Multilingual TTS | provider-priced |
| `elevenlabs.musicModel()` | Music generation | provider-priced |
| `groq.transcription("whisper-large-v3")` | Speech-to-text | provider-priced |

Cache hits are local and do not call providers.

## CLI

```bash
bunx vargai init                               # set up project (template + folders)
bunx vargai render video.tsx                   # render a video
bunx vargai render video.tsx --preview         # free preview with placeholders
bunx vargai render video.tsx --verbose         # render with detailed output
bunx vargai run image --prompt "sunset"        # generate a single image
bunx vargai run video --prompt "ocean waves"   # generate a single video
bunx vargai list                               # list available models and actions
bunx vargai studio                             # open visual editor
```

## Environment

```bash
# Direct provider keys
FAL_API_KEY=fal_xxx
ELEVENLABS_API_KEY=xxx
OPENAI_API_KEY=sk_xxx
REPLICATE_API_TOKEN=r8_xxx
GROQ_API_KEY=gsk_xxx
CLOUDFLARE_R2_PUBLIC_URL=https://cdn.example.com   # if using R2 uploads
FONT_ASSET_BASE_URL=https://cdn.example.com/fonts  # optional caption fonts
EMOJI_ASSET_BASE_URL=https://cdn.example.com/emoji # optional color emoji overlays
```

Bun auto-loads `.env` files.

## Pricing

| Action | Model | Provider billing |
|--------|-------|------------------|
| Image | nano-banana-pro | provider-priced |
| Image | flux-pro | provider-priced |
| Video (5s) | kling-v3 | provider-priced |
| Speech | eleven_v3 | provider-priced |
| Music | music_v1 | provider-priced |
| Cache hit | any | free |

A typical 3-clip video cost depends on your selected providers. Cache hits are local and do not call providers.

## Star History

<img width="2832" height="2253" alt="star-history-202643" src="https://github.com/user-attachments/assets/63e84279-d756-43a9-b328-118fb69ed2d5" />




## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup.

## License

Apache-2.0 — see [LICENSE.md](LICENSE.md)
