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
