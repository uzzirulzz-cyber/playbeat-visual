# PlayBeat Visual

Creative tools for https://visual.playbeat.live/. The original live frontend is preserved at `public/index.html`; its **Open creative studio** button opens the new workspace at `/studio/`.

## Interface

The Studio uses the uploaded Start Bootstrap SB Admin v7.0.7 template and its bundled Bootstrap 5.2.3 CSS, served locally from `public/studio/vendor/sb-admin/`. It includes a responsive dashboard shell, collapsible sidebar, workspace navigation, Bootstrap buttons and form controls. The original editor remains available. Third-party license notices are included with the vendored stylesheet.

## Implemented

- **Design:** poster, social, and video-cover templates; editable text, shapes, uploaded images; layer selection, drag positioning, Shift/grid snapping, stacking, duplication, sizing, color, opacity, canvas alignment, undo/redo, and custom canvas dimensions.
- **Save/export:** downloadable and reopenable design project JSON, PNG, and SVG. Images are embedded in projects. SVG preserves shapes and images but rasterizes text to preserve browser wrapping; JSON retains editable text.
- **Video:** import multiple local clips, sequential timeline, trim, split at playhead, reorder/delete clips, seek and preview, editable sequence caption, design overlays, cuts or fade-through-black transitions, background music and volume controls, and real-time WebM export with mixed audio.
- **Built-in effects:** cinematic, vintage, monochrome, vivid, and cool looks; brightness, contrast, saturation; slow zoom-in/out and left/right video pans. These run locally without provider accounts, keys, or paid APIs. Looks apply to uploaded images and video; motion applies to video. Effects are included in PNG/WebM exports, but not SVG, and settings are session-only.

- **OpenRouter AI:** image-aware enhancement suggestions, editable layouts from prompts, selected-text rewriting, caption drafting from a brief, and generated/edited image previews that can be added as layers. Suggestions are reviewed before applying. Provider credentials remain in Cloudflare; no provider API key is entered into the editor.

Text-to-video synthesis, voice transcription, segmentation/background removal, collaborative editing, and the complete proprietary feature sets of other editors are not provided by this integration. A general text/vision OpenRouter model does not automatically enable those capabilities. The earlier optional Replicate adapter remains separate and is not used by the Studio UI.

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

### Existing OpenRouter connection

Set or reuse the existing Cloudflare secret binding `OPENROUTER_API_KEY`. The handler also recognizes `OPENROUTER_KEY` or a binding literally named `secret`; do not create duplicate keys when an existing binding works. No secret value belongs in GitHub or the browser. This workspace could not inspect the Cloudflare account's secret values, and live model calls have not been verified.

| Setting | Purpose |
| --- | --- |
| `OPENROUTER_API_KEY` | Existing OpenRouter key, stored as a Cloudflare secret. |
| `OPENROUTER_MODEL` | Optional text/vision model ID, default `openai/gpt-4o-mini`. Must accept images for image-aware enhancement and JSON output for editable plans. |
| `OPENROUTER_IMAGE_MODEL` | An available OpenRouter model with image output and the required text/image inputs. Needed only for image generation/editing; no second provider is required. Verify current model capabilities in OpenRouter. |
| `STUDIO_ACCESS_KEY` | Optional secret for restricting paid API use. When configured, authorized users enter this application access key, never the OpenRouter token. |

Deploy the Pages functions with the static files, and preserve the existing Cloudflare binding. `/api/ai` GET reports only configuration metadata. POST sends the chosen instruction and, for enhancement/image editing, a downscaled canvas preview to OpenRouter. Requests can consume provider credits. A missing binding/model or provider error is shown explicitly. Existing legacy `/api/ai` action responses are supported for the recovered original editor.

The server validates requests and uses a best-effort per-isolate request limit. That limit and same-origin checks are not account authentication or global spend controls. Restrict production access using `STUDIO_ACCESS_KEY` or Cloudflare Access and set OpenRouter budget limits. Keep image-output model selection server-side. Generated images are embedded PNG/JPEG/WebP previews, not remote executable content.

The optional `functions/api/generate.js` Replicate adapter is retained from the earlier implementation, but the Studio does not call it. It requires its own provider configuration and is unrelated to the existing OpenRouter connection.

## Validation

```sh
npm test
```

Seventeen unit/API tests cover timeline mapping, split boundaries, project validation, alignment, generation authorization, OpenRouter binding aliases, safe model requests, image outputs, malformed responses, and legacy action compatibility. Provider calls are mocked; live OpenRouter requests remain unverified.

For the browser smoke test, install Chromium and FFmpeg, start `npm run dev`, and generate local test media:

```sh
ffmpeg -f lavfi -i color=c=blue:s=320x240:d=1.5 -f lavfi -i sine=frequency=440:duration=1.5 -c:v libvpx -c:a libvorbis -shortest -y /tmp/playbeat-test.webm
ffmpeg -f lavfi -i sine=frequency=220:duration=3 -y /tmp/playbeat-music.wav
npm run test:browser
```

The test defaults to `/usr/bin/chromium`; override `CHROMIUM_PATH` if necessary. `STUDIO_URL`, `TEST_VIDEO`, and `TEST_AUDIO` can override the URL/media paths. Browser tests exercise real editing and media exports, Bootstrap navigation, mobile layout, and mocked AI review/application and invalid-plan rejection. Artifacts are saved outside the repository under `/tmp/playbeat-browser-results/`.
