# PlayBeat Visual

Creative tools for https://visual.playbeat.live/. The original live frontend is preserved at `public/index.html`; its **Open creative studio** button opens the new workspace at `/studio/`.

## Implemented

- **Design:** poster, social, and video-cover templates; editable text, shapes, uploaded images; layer selection, drag positioning, Shift/grid snapping, stacking, duplication, sizing, color, opacity, canvas alignment, undo/redo, and custom canvas dimensions.
- **Save/export:** downloadable and reopenable design project JSON, PNG, and SVG. Images are embedded in projects. SVG preserves shapes and images but rasterizes text to preserve browser wrapping; JSON retains editable text.
- **Video:** import multiple local clips, sequential timeline, trim, split at playhead, reorder/delete clips, seek and preview, editable sequence caption, design overlays, cuts or fade-through-black transitions, background music and volume controls, and real-time WebM export with mixed audio.
- **Built-in effects:** cinematic, vintage, monochrome, vivid, and cool looks; brightness, contrast, saturation; slow zoom-in/out and left/right video pans. These run locally without provider accounts, keys, or paid APIs. Looks apply to uploaded images and video; motion applies to video. Effects are included in PNG/WebM exports, but not SVG, and settings are session-only.

The Studio does not include text-to-video scene generation. The earlier optional API adapter remains in `functions/api/generate.js`, but the editor no longer exposes provider setup or generation controls. No provider configuration is needed for the built-in editor.

These are initial tools inspired by the requested workflows, not full Canva, Figma, CapCut, or Higgsfield replacements. Collaborative editing, reusable component libraries, arbitrary video tracks, automatic speech captions, and MP4 encoding are not implemented. Video export is WebM and runs in real time; keep the tab active. Video/audio source files and timeline edits are session-only and are not included in saved design JSON. Export before closing. Decode support depends on your browser; H.264 MP4 and WebM are recommended inputs.

## Local development

Use Node 24 and Python 3:

```sh
npm ci
npm run dev
```

The static site runs on port 8010. Open `/studio/` to use the new editor. The static Python server does **not** run Cloudflare API functions; design and local video editing work without AI configuration.

## Cloudflare deployment

1. In **Workers & Pages**, connect this repository to a **Pages** project, or use an existing compatible Pages project.
2. Set the production branch to `main`, leave the build command empty, and set the build output directory to `public` (repository root remains the default).
3. Pages deploys the root `functions/` directory alongside the static files. A static file-only upload will not install the AI API.
4. Confirm `/studio/` loads and the original editor still opens. Connect `visual.playbeat.live` to this Pages project only after testing its preview deployment. Preserve/export the original Worker code and bindings before changing a current Worker deployment.

This repository does not automatically replace an existing standalone Worker. Pushing code to GitHub alone does not prove the live domain updated.

### Optional unused generation backend

Set these values in the Cloudflare Pages project's production/preview environment settings, then redeploy:

| Name | Purpose |
| --- | --- |
| `REPLICATE_API_TOKEN` | Secret provider token. Requires provider access and billing. |
| `STUDIO_ACCESS_KEY` | Secret chosen by the site administrator for authorized API clients. Keep private. It protects the optional paid generation API. |
| `REPLICATE_MODEL` | Supported video model in `owner/model` form, such as `minimax/video-01`. Verify its current availability, costs, and schema with Replicate. |
| `REPLICATE_IMAGE_INPUT` | Optional image field name; defaults to `first_frame_image`. Must match the chosen model's schema. |

The chosen model must support Replicate's model prediction endpoint and `prompt` input. Image mode also requires support for the configured image input. Provider tokens stay server-side. The built-in editor does not request a studio access key. Provider output URLs may expire. Never commit tokens, access keys, `.env`, or `.dev.vars`.

The original editor also calls `/api/ai`. Its original backend was not recoverable from the public page and is not supplied here; preserve its existing Worker if that legacy endpoint is needed. The retained optional adapter endpoint is `/api/generate`; there is no generation UI.

## Validation

```sh
npm test
```

Ten unit/API tests cover timeline mapping, split boundaries, project validation, alignment, server configuration, authorization, request validation, provider calls, polling, and sanitized errors. Provider calls in these tests are mocked; live AI generation requires the settings above and has not been verified.

For the browser smoke test, install Chromium and FFmpeg, start `npm run dev`, and generate local test media:

```sh
ffmpeg -f lavfi -i color=c=blue:s=320x240:d=1.5 -f lavfi -i sine=frequency=440:duration=1.5 -c:v libvpx -c:a libvorbis -shortest -y /tmp/playbeat-test.webm
ffmpeg -f lavfi -i sine=frequency=220:duration=3 -y /tmp/playbeat-music.wav
npm run test:browser
```

The test defaults to `/usr/bin/chromium`; override `CHROMIUM_PATH` if necessary. `STUDIO_URL`, `TEST_VIDEO`, and `TEST_AUDIO` can override the URL/media paths. The browser test exercises real editing, save, PNG export, and video import/trim/split with music, caption, transition, and actual WebM recording. Artifacts are saved outside the repository under `/tmp/playbeat-browser-results/`.
