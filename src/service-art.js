// AI-generated conceptual scientific illustrations, not diagnostic micrographs.
const images = ['haematology','chemistry','immunoassays','serology','microbiology','parasitology','histology'];
export function serviceArt(index) {
  const name = images[index];
  return `<img class="service-art" src="/assets/services/${name}.webp" srcset="/assets/services/${name}-small.webp 420w, /assets/services/${name}.webp 840w" sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 900px) 45vw, 30vw" width="840" height="560" alt="" loading="lazy" decoding="async">`;
}
