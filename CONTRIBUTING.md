# Contributing

Thank you for helping improve the Compact Choc V2 Numpad.

## Development setup

You need Node.js 22 or later, npm, and Python 3. Install Java only when running
Freerouting. KiCad 10 and ImageMagick are needed for the full DRC, Gerber,
render, and 1:1-print workflows.

```bash
npm ci --allow-git=all
npm run ci
```

For the complete local hardware pipeline:

```bash
npm run setup:router
npm run generate
npm run validate
npm run print:1to1
npm run gerbers
```

## Source and generated files

Edit `config.yaml`, the files under `footprints/`, `scripts/`, or `firmware/`.
Do not commit `node_modules/`, `.cache/`, or `output/`; those products are
reproducible and intentionally ignored.

Mechanical and footprint changes must state their source dimensions and their
effect on the physical design. Before proposing a manufacturing-sensitive
change, print the generated PDF at exactly 100%, check the exact parts, and run
KiCad DRC. Do not silence DRC errors merely to make a check pass.

## Pull requests

Keep each pull request focused. Include:

- the reason for the change;
- commands used for verification;
- photos or measurements for physical-fit changes; and
- any BOM, GPIO, firmware, or enclosure compatibility impact.

The project has not completed a physical revision-A validation yet, so clearly
label assumptions and untested community-derived geometry.
