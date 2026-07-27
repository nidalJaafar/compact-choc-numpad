#!/usr/bin/env python
"""Export a centered A3, true-scale footprint check PDF."""

from pathlib import Path
import subprocess
import tempfile

import pcbnew


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "output" / "pcbs" / "compact_choc_numpad.kicad_pcb"
OUTPUT = ROOT / "output" / "pdf" / "compact_choc_numpad-1to1.pdf"


def main() -> None:
    board = pcbnew.LoadBoard(str(SOURCE))
    bounds = board.GetBoardEdgesBoundingBox()

    # A3 landscape is 420 x 297 mm. Move only the temporary plotting copy so
    # negative design coordinates cannot be clipped by the PDF page boundary.
    center = bounds.GetCenter()
    target = pcbnew.VECTOR2I_MM(210, 148.5)
    board.Move(target - center)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="compact-numpad-print-") as temp_dir:
        plot_board = Path(temp_dir) / "centered.kicad_pcb"
        pcbnew.SaveBoard(str(plot_board), board)
        subprocess.run(
            [
                "kicad-cli", "pcb", "export", "pdf", str(plot_board),
                "--output", str(OUTPUT),
                "--layers", "Edge.Cuts,F.Cu,B.Cu,F.Fab,B.Fab,F.SilkS,B.SilkS,Dwgs.User",
                "--mode-single", "--scale", "1", "--black-and-white",
                "--drill-shape-opt", "2",
            ],
            check=True,
            cwd=ROOT,
        )

    print(f"Saved centered 1:1 print to {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
