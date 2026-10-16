# PlayBeat Visual

Frontend recovered from https://visual.playbeat.live/ on 2026-10-16.
The deployed HTML, styles, and browser JavaScript are preserved in `public/index.html`.

## Run locally

```sh
python3 -m http.server 8000 --directory public
```

Open the local server in your browser. Image upload, adjustments, text, browser-local projects, and image exports are implemented by the recovered frontend. Inline JavaScript syntax was checked; interactive browser behavior has not been revalidated in this repository.

## Cloudflare hosting

For a Cloudflare Pages static deployment, use `public` as the output directory; no build command is needed. Connect this GitHub repository in Cloudflare to enable deployment from future commits. Uploading to GitHub does not update the current live site automatically unless its deployment is connected.

The existing frontend calls `POST /api/ai`. Its original Cloudflare Worker code, provider configuration, and secrets were not recoverable from the public website and are **not included**. A static deployment alone will not provide AI editing. Preserve the existing Worker until its source and bindings are exported. Never commit API keys.

The requested Canva/Figma-style design, CapCut-style video timeline, and Higgsfield-style generation features remain planned, not implemented.

---

# PlayBeat Visual: design, video editing, and AI tools

Target app: https://visual.playbeat.live/

## Requested features

- Canva-style design: templates, text styling, image uploads, crop and resize, backgrounds, and PNG/SVG export.
- Figma-style layout: layers, groups, frames, alignment guides, snapping, reusable components, and undo/redo.
- CapCut-style video editing: a multitrack timeline, trim and split, clip ordering, transitions, captions, music, volume controls, and video export.
- Higgsfield-style AI creation: text-to-video, image-to-video, camera motion presets, and effects through a supported AI provider.

## Implementation prerequisites

Locate or connect the existing Visual editor source before implementing these features. The currently connected ebuzz checkout contains a TV catalog/player rather than the Visual editing app. Preserve the existing app instead of replacing it with the TV player.

Choose an AI provider and configure credentials securely on the server; do not expose keys in the browser. Confirm provider capabilities, costs, and export requirements before integrating generation.

## Acceptance criteria

- Users can create and reopen a design with editable text, images, and layers, then export it.
- Users can import video, trim and split clips, add captions and audio, preview the timeline, and export a playable video with synchronized audio.
- AI generation reports progress and errors, and generated assets can be inserted into a project.
- Existing projects and current editor behavior remain functional.

Status: requested scope only; features have not been implemented or deployed.
