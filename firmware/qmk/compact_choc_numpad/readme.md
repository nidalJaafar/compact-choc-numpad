# Compact Choc Numpad QMK firmware

This definition targets the headerless Waveshare-compatible RP2040-Zero used
by the PCB. It matches the hardware nets in `config.yaml`:

| Function | Pin |
| --- | --- |
| Columns 0–3 | GP0–GP3 |
| Rows 0–4 | GP4–GP8 |
| Encoder A / B | GP14 / GP15 |
| Encoder push | GP26 to GND |

The matrix uses `COL2ROW`. Encoder push is a direct active-low input handled by
QMK's dip-switch scanner; despite the subsystem name, a momentary switch wired
from the configured pin to ground is supported.

## Build

Install QMK by following its official setup guide, then copy this directory
into the root of the QMK keyboard tree:

```bash
cp -R firmware/qmk/compact_choc_numpad ~/qmk_firmware/keyboards/
cd ~/qmk_firmware
qmk compile -kb compact_choc_numpad -km default
```

The default keymap is:

```text
[ Num ] [  /  ] [  *  ] [  -  ]
[  7  ] [  8  ] [  9  ] [  +  ]
[  4  ] [  5  ] [  6  ] [  =  ]
[  1  ] [  2  ] [  3  ] [Enter]
[  0  ] [  .  ] [Back ] [ Fn  ]
```

The encoder controls volume, and its push switch sends mute. The Fn layer adds
navigation keys and `QK_BOOT` at the upper-left position.

## Flash

Hold BOOT while connecting USB, or double-tap RESET, and copy the generated
UF2 to the `RPI-RP2` drive. No dedicated reset switch is present on the PCB;
the controller module's onboard buttons remain available under the removable
cover.

The `0xFEED:0x2040` USB identifier is suitable for personal development only.
Choose an appropriately assigned VID/PID before distributing a commercial
product.
