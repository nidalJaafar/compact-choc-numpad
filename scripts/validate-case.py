#!/usr/bin/env python3
"""Validate generated case meshes and render an isometric QA preview."""

from pathlib import Path
import sys

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import numpy as np
import trimesh


ROOT = Path(__file__).resolve().parents[1]
STL_DIR = ROOT / "output" / "stl"
PREVIEW = ROOT / "output" / "case-preview.png"
PARTS = {
    "bottom_tray": np.array([87.3, 129.6, 13.4]),
    "top_cover": np.array([87.3, 129.6, 7.6]),
}


def main() -> None:
    meshes = []
    failed = False

    for name, expected_extents in PARTS.items():
        path = STL_DIR / f"{name}.stl"
        mesh = trimesh.load_mesh(path, process=True)
        meshes.append((name, mesh))
        extents = mesh.extents
        dimensions_ok = np.allclose(extents, expected_extents, atol=0.08)
        connected = len(mesh.split(only_watertight=False)) == 1
        valid = mesh.is_watertight and mesh.is_volume and connected and dimensions_ok
        failed |= not valid
        print(
            f"{name}: extents={np.round(extents, 3).tolist()} mm, "
            f"watertight={mesh.is_watertight}, volume={mesh.is_volume}, "
            f"connected={connected}, faces={len(mesh.faces)}, valid={valid}"
        )

    top_mesh = dict(meshes)["top_cover"].copy()
    top_mesh.apply_translation([0, 0, 7.8])
    assembled = trimesh.util.concatenate([dict(meshes)["bottom_tray"], top_mesh])
    meshes.append(("assembled_case", assembled))

    fig = plt.figure(figsize=(16, 6), dpi=160)
    for index, (name, mesh) in enumerate(meshes, start=1):
        axis = fig.add_subplot(1, 3, index, projection="3d")
        triangles = mesh.triangles
        if len(triangles) > 18000:
            triangles = triangles[:: int(np.ceil(len(triangles) / 18000))]
        collection = Poly3DCollection(
            triangles,
            facecolor="#d6d0bd",
            edgecolor="#605b50",
            linewidth=0.08,
            alpha=1,
        )
        axis.add_collection3d(collection)
        center = mesh.bounds.mean(axis=0)
        radius = max(mesh.extents) / 2
        axis.set_xlim(center[0] - radius, center[0] + radius)
        axis.set_ylim(center[1] - radius, center[1] + radius)
        axis.set_zlim(0, radius * 2)
        axis.set_box_aspect((1, 1, 0.45))
        # The cover is exported in its assembled orientation, with the
        # recessed cedar emblem on the visible +Z exterior face.
        elevation = 38 if name == "top_cover" else 28
        axis.view_init(elev=elevation, azim=-55)
        axis.set_title(name.replace("_", " ").title())
        axis.set_axis_off()
    fig.tight_layout()
    fig.savefig(PREVIEW, bbox_inches="tight", facecolor="#f4f1e8")
    print(f"Saved {PREVIEW.relative_to(ROOT)}")

    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
