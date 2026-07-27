#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
version="${1:-dev}"
safe_version="${version//[^A-Za-z0-9._-]/-}"
release_root="${project_root}/output/release/${safe_version}"
release_prefix="compact-choc-numpad-${safe_version}"

required_files=(
  "output/compact_choc_numpad-gerbers.zip"
  "output/compact_choc_numpad-top.png"
  "output/case-preview.png"
  "output/pdf/compact_choc_numpad-1to1.pdf"
  "output/pcbs/compact_choc_numpad.kicad_pcb"
  "output/pcbs/compact_choc_numpad-routed.kicad_pcb"
  "output/pcbs/compact_choc_numpad-routed-drc.rpt"
  "output/pcbs/compact_choc_numpad-routed.kicad_pro"
  "output/pcbs/fp-lib-table"
  "output/stl/bottom_tray.stl"
  "output/stl/top_cover.stl"
)

for relative_path in "${required_files[@]}"; do
  if [[ ! -s "${project_root}/${relative_path}" ]]; then
    echo "Missing ${relative_path}; run the full generation pipeline first." >&2
    exit 1
  fi
done

mkdir -p "${release_root}"
find "${release_root}" -mindepth 1 -maxdepth 1 -delete

cp "${project_root}/output/compact_choc_numpad-gerbers.zip" \
  "${release_root}/${release_prefix}-gerbers.zip"
cp "${project_root}/output/compact_choc_numpad-top.png" \
  "${release_root}/${release_prefix}-pcb-preview.png"
cp "${project_root}/output/case-preview.png" \
  "${release_root}/${release_prefix}-case-preview.png"
cp "${project_root}/output/pdf/compact_choc_numpad-1to1.pdf" \
  "${release_root}/${release_prefix}-1to1.pdf"

bsdtar -a -cf "${release_root}/${release_prefix}-stl.zip" \
  -C "${project_root}/output/stl" bottom_tray.stl top_cover.stl

bsdtar -a -cf "${release_root}/${release_prefix}-kicad.zip" \
  -C "${project_root}" \
  output/pcbs/compact_choc_numpad.kicad_pcb \
  output/pcbs/compact_choc_numpad-routed.kicad_pcb \
  output/pcbs/compact_choc_numpad-routed-drc.rpt \
  output/pcbs/compact_choc_numpad-routed.kicad_pro \
  output/pcbs/fp-lib-table \
  output/pcbs/CompactNumpad.pretty

bsdtar -a -cf "${release_root}/${release_prefix}-ergogen.zip" \
  -C "${project_root}" \
  config.yaml \
  footprints/ceoloide/LICENSE \
  footprints/ceoloide/mounting_hole_npth.js \
  footprints/diode_do35.js \
  footprints/pec11r_4215f_s0024.js \
  footprints/rp2040_zero.js \
  footprints/switch_choc_v2_hotswap.js

bsdtar -a -cf "${release_root}/${release_prefix}-documentation.zip" \
  -C "${project_root}" \
  README.md BOM_FINAL.md THIRD_PARTY_NOTICES.md \
  output/pdf/compact_choc_numpad-1to1.pdf

component_archives=(
  "${release_prefix}-gerbers.zip"
  "${release_prefix}-stl.zip"
  "${release_prefix}-kicad.zip"
  "${release_prefix}-ergogen.zip"
  "${release_prefix}-documentation.zip"
  "${release_prefix}-pcb-preview.png"
  "${release_prefix}-case-preview.png"
  "${release_prefix}-1to1.pdf"
)

bsdtar -a -cf "${release_root}/${release_prefix}-complete.zip" \
  -C "${release_root}" "${component_archives[@]}" \
  -C "${project_root}" firmware/qmk/compact_choc_numpad

(
  cd "${release_root}"
  sha256sum "${release_prefix}"-* > SHA256SUMS.txt
  for archive in ./*.zip; do
    unzip -tq "${archive}"
  done
)

echo "Packaged release assets in ${release_root#"${project_root}/"}"
