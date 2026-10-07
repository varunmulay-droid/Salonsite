/**
 * Hotspots on the 3D vanity. `nodes` are matched (case/punctuation-insensitive)
 * against node names inside /public/models/vanity.glb:
 *   drawer, main desk, make up box, Mirror, sittign coushion
 * Each point is tied to a real service from salon-data.
 */
export type VanityHotspot = {
  id: string;
  label: string;
  nodes: string[];
  serviceSlug: string;
  blurb: string;
  /** "top" pins the dot to the top surface; default pins it to the visible surface */
  anchor?: "top";
};

export const vanityHotspots: VanityHotspot[] = [
  {
    id: "mirror",
    label: "The mirror",
    nodes: ["mirror"],
    serviceSlug: "makeup",
    blurb: "Undertone is matched in north light, at the mirror, before a single product is opened.",
  },
  {
    id: "desk",
    label: "The vanity desk",
    nodes: ["maindesk"],
    anchor: "top",
    serviceSlug: "bridal",
    blurb: "The working surface for the long morning: hair, skin and makeup laid out in order.",
  },
  {
    id: "box",
    label: "The makeup box",
    nodes: ["makeupbox"],
    serviceSlug: "brows",
    blurb: "Small tools, drawn with a very sharp pencil. The frame of the face starts here.",
  },
  {
    id: "drawer",
    label: "The drawer",
    nodes: ["drawer"],
    serviceSlug: "colour",
    blurb: "Pigment kept close: colour is mixed in small bowls, strand by strand.",
  },
  {
    id: "seat",
    label: "The seat",
    nodes: ["coushion", "cushion"],
    serviceSlug: "cut",
    blurb: "Every service starts seated, with a consultation, never a catalogue number.",
  },
];
