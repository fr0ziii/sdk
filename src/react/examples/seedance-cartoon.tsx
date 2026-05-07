/** @jsxImportSource vargai */
/**
 * Seedance 2 Cartoon — direct provider composable test.
 *
 * Generates a cartoon image via fal, then uses it as a Seedance reference via PiAPI.
 * Run: FAL_API_KEY=fal_xxx PIAPI_API_KEY=piapi_xxx bun run src/react/examples/seedance-cartoon.tsx
 */
import { fal } from "../../ai-sdk/providers/fal";
import { piapi } from "../../ai-sdk/providers/piapi";
import { Clip, Image, Render, Video } from "../index";
import { render } from "../render";

const image = Image({
  prompt:
    "a cheerful orange cat mascot, clean 3D cartoon style, white background",
  model: fal.imageModel("flux-schnell"),
  aspectRatio: "9:16",
});

const scene = (
  <Render width={1080} height={1920}>
    <Clip duration={5}>
      <Video
        prompt={{
          text: "@image1 starts dancing happily, playful bouncy motion, colorful cartoon energy",
          images: [image],
        }}
        model={piapi.videoModel("seedance-2-preview")}
      />
    </Clip>
  </Render>
);

if (import.meta.main) {
  const result = await render(scene, { output: "output/seedance-cartoon.mp4" });
  console.log(`rendered ${result.video.byteLength} bytes`);
}

export default scene;
