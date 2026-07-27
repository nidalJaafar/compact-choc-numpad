#!/usr/bin/env python3
"""Create an exact project-local footprint library and relink the PCBs to it."""

from pathlib import Path

import pcbnew


ROOT = Path(__file__).resolve().parents[1]
PCB_DIR = ROOT / "output" / "pcbs"
LIB_NAME = "CompactNumpad"
LIB_DIR = PCB_DIR / f"{LIB_NAME}.pretty"
LIB_TABLE = PCB_DIR / "fp-lib-table"
BOARD_PATHS = (
    PCB_DIR / "compact_choc_numpad.kicad_pcb",
    PCB_DIR / "compact_choc_numpad-routed.kicad_pcb",
)


def sync_footprints() -> None:
    existing_boards = [path for path in BOARD_PATHS if path.exists()]
    if not existing_boards:
        raise SystemExit("No generated KiCad PCB was found.")

    # Prefer the routed PCB as the canonical copy because it has passed through
    # KiCad's current serializer. The embedded footprint geometry is otherwise
    # identical to the generated source PCB.
    canonical_path = next(
        (path for path in reversed(existing_boards) if "-routed" in path.name),
        existing_boards[0],
    )
    canonical = pcbnew.LoadBoard(str(canonical_path))
    plugin = pcbnew.PCB_IO_KICAD_SEXPR()
    if not LIB_DIR.exists():
        plugin.CreateLibrary(str(LIB_DIR))

    saved_items: set[str] = set()
    for footprint in canonical.GetFootprints():
        item_name = str(footprint.GetFPID().GetLibItemName())
        if item_name in saved_items:
            continue
        plugin.FootprintSave(str(LIB_DIR), footprint)
        saved_items.add(item_name)

    for board_path in existing_boards:
        board = pcbnew.LoadBoard(str(board_path))
        for footprint in board.GetFootprints():
            item_name = str(footprint.GetFPID().GetLibItemName())
            footprint.SetFPID(pcbnew.LIB_ID(LIB_NAME, item_name))
        pcbnew.SaveBoard(str(board_path), board)

    LIB_TABLE.write_text(
        '(fp_lib_table\n'
        f'  (lib (name "{LIB_NAME}")(type "KiCad")'
        f'(uri "${{KIPRJMOD}}/{LIB_NAME}.pretty")'
        '(options "")(descr "Exact project-local footprints"))\n'
        ')\n',
        encoding="utf-8",
    )
    print(
        f"Relinked {len(existing_boards)} PCB(s) to {len(saved_items)} exact "
        f"footprints in {LIB_DIR.relative_to(ROOT)}"
    )


if __name__ == "__main__":
    sync_footprints()
