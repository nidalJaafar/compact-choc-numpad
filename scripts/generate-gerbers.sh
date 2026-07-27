#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
pcb_file="${project_root}/output/pcbs/compact_choc_numpad-routed.kicad_pcb"
gerber_dir="${project_root}/output/gerbers"
archive="${project_root}/output/compact_choc_numpad-gerbers.zip"

mkdir -p "${gerber_dir}"
find "${gerber_dir}" -maxdepth 1 -type f -delete

kicad-cli pcb export gerbers "${pcb_file}" \
  --output "${gerber_dir}" \
  --layers F.Cu,B.Cu,F.Mask,B.Mask,F.SilkS,B.SilkS,Edge.Cuts \
  --subtract-soldermask \
  --check-zones

kicad-cli pcb export drill "${pcb_file}" \
  --output "${gerber_dir}" \
  --format excellon \
  --drill-origin absolute \
  --excellon-units mm \
  --excellon-zeros-format decimal \
  --excellon-oval-format alternate \
  --excellon-separate-th \
  --generate-report \
  --report-path "${gerber_dir}/drill-report.txt"

archive_tmp="$(mktemp --suffix=.zip)"
bsdtar -a -cf "${archive_tmp}" -C "${gerber_dir}" \
  compact_choc_numpad-routed-F_Cu.gtl \
  compact_choc_numpad-routed-B_Cu.gbl \
  compact_choc_numpad-routed-F_Mask.gts \
  compact_choc_numpad-routed-B_Mask.gbs \
  compact_choc_numpad-routed-F_Silkscreen.gto \
  compact_choc_numpad-routed-B_Silkscreen.gbo \
  compact_choc_numpad-routed-Edge_Cuts.gm1 \
  compact_choc_numpad-routed-PTH.drl \
  compact_choc_numpad-routed-NPTH.drl \
  compact_choc_numpad-routed-job.gbrjob
mv "${archive_tmp}" "${archive}"
chmod 644 "${archive}"
unzip -tq "${archive}"
echo "Saved ${archive#"${project_root}/"}"
