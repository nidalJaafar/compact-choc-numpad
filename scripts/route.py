#!/usr/bin/env python
"""Route the Ergogen PCB through Freerouting and import the result into KiCad."""

from pathlib import Path
import subprocess

import pcbnew

from sync_kicad_footprints import sync_footprints


ROOT = Path(__file__).resolve().parents[1]
PCB_DIR = ROOT / "output" / "pcbs"
SOURCE = PCB_DIR / "compact_choc_numpad.kicad_pcb"
DSN = PCB_DIR / "compact_choc_numpad.dsn"
SES = PCB_DIR / "compact_choc_numpad.ses"
ROUTED = PCB_DIR / "compact_choc_numpad-routed.kicad_pcb"
ROUTER = (
    ROOT
    / ".cache"
    / "freerouting"
    / "runtime"
    / "freerouting-2.2.4-linux-x64"
    / "bin"
    / "freerouting"
)


def add_switch_column_trunks(board: pcbnew.BOARD) -> None:
    """Pre-route each switch column along the outer socket pads.

    Choc V2's centre hole and extra mounting post leave a narrow channel that
    Freerouting does not reliably discover. The outer pad-2 centres form a
    straight, manufacturer-defined path clear of both holes.
    """
    columns: dict[str, list[pcbnew.VECTOR2I]] = {}

    for footprint in board.GetFootprints():
        if not footprint.GetReference().startswith("SW"):
            continue

        pad_candidates = [
            pad
            for pad in footprint.Pads()
            if pad.GetNumber() == "2" and pad.GetAttribute() == pcbnew.PAD_ATTRIB_SMD
        ]
        if not pad_candidates:
            continue

        center = footprint.GetPosition()
        outer_pad = max(
            pad_candidates,
            key=lambda pad: (pad.GetPosition() - center).EuclideanNorm(),
        )
        net_name = outer_pad.GetNetname()
        if net_name.startswith("COL"):
            columns.setdefault(net_name, []).append(outer_pad.GetPosition())

    for net_name, points in columns.items():
        net = board.FindNet(net_name)
        for start, end in zip(sorted(points, key=lambda point: point.y),
                              sorted(points, key=lambda point: point.y)[1:]):
            track = pcbnew.PCB_TRACK(board)
            track.SetStart(start)
            track.SetEnd(end)
            track.SetWidth(pcbnew.FromMM(0.25))
            track.SetLayer(pcbnew.B_Cu)
            track.SetNet(net)
            board.Add(track)


def add_final_row4_feed(board: pcbnew.BOARD) -> None:
    """Pre-route GP8 to ROW4 through the clear column-0/1 channel."""
    controller = board.FindFootprintByReference("MCU1")
    diode = board.FindFootprintByReference("D6")
    if controller is None or diode is None:
        return
    start = next(p for p in controller.Pads() if p.GetNumber() == "GP8").GetPosition()
    target = next(p for p in diode.Pads() if p.GetNumber() == "1").GetPosition()
    net = board.FindNet("ROW4")
    route_points = [
        start,
        pcbnew.VECTOR2I_MM(19.0, -85.5),
        pcbnew.VECTOR2I_MM(10.5, -85.5),
        pcbnew.VECTOR2I_MM(10.5, 9.0),
        pcbnew.VECTOR2I(target.x, pcbnew.FromMM(9.0)),
        target,
    ]
    for segment_start, segment_end in zip(route_points, route_points[1:]):
        track = pcbnew.PCB_TRACK(board)
        track.SetStart(segment_start)
        track.SetEnd(segment_end)
        track.SetWidth(pcbnew.FromMM(0.25))
        track.SetLayer(pcbnew.F_Cu)
        track.SetNet(net)
        board.Add(track)


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit("Missing Ergogen PCB. Run `npm run generate:layout` first.")
    if not ROUTER.exists():
        raise SystemExit("Missing Freerouting. Run `npm run setup:router` first.")

    board = pcbnew.LoadBoard(str(SOURCE))
    add_switch_column_trunks(board)
    add_final_row4_feed(board)
    if not pcbnew.ExportSpecctraDSN(board, str(DSN)):
        raise SystemExit("KiCad failed to export the Specctra DSN file.")

    subprocess.run(
        [
            str(ROUTER),
            "-de",
            str(DSN),
            "-do",
            str(SES),
            "--gui.enabled=false",
            "--router.max_passes=30",
        ],
        check=True,
        cwd=ROOT,
    )

    routed = pcbnew.LoadBoard(str(SOURCE))
    if not pcbnew.ImportSpecctraSES(routed, str(SES)):
        raise SystemExit("KiCad failed to import the routed Specctra session.")
    pcbnew.SaveBoard(str(ROUTED), routed)
    sync_footprints()
    DSN.unlink(missing_ok=True)
    SES.unlink(missing_ok=True)
    print(f"Saved routed board to {ROUTED.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
