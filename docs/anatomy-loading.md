# Anatomy loading

The explorer uses a transparent still rendered from the detailed 3D torso while its model loads. The live canvas becomes visible only after its first rendered frame; the former simplified SVG is no longer used. Desktop and mobile posters match their respective default viewpoints.

If model loading or WebGL fails, the detailed still remains visible and the body-system tabs still show related tests. Busy state is exposed to assistive technology. Anatomical hotspots appear only when the interactive model is ready.

The posters are derived from the existing attributed model and retain its CC BY-SA 4.0 terms; see `public/assets/anatomy/NOTICE.md`.
