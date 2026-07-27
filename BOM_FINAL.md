# Final locked BOM

**Project:** Compact wired low-profile PG1353 tactile numpad  
**Locked:** 2026-07-27  
**Status:** Final purchasing list supplied by the project owner

| Item | Required for one build | Purchase quantity | Spare quantity | Supplier |
|---|---:|---:|---:|---|
| RP2040-Zero development board, headerless | 1 | 3 | 2 | [ChiBox](https://chibox.app/products/p-754141514242?n=RP2040-Zero+development+board+compatible+with+Raspberry+Pi+Pico+dual-core+microcontroller+learning+b&p=1.7273&c=%24) |
| Kailh PG1353 ("Black Tea") tactile switches | 20 | 22 | 2 | [ChiBox](https://chibox.app/products/p-845942737255?n=Kaihua+Kailh+Low+Profile+1353+Round+Head+Series+RGB+Black+Tea+Personality+Gaming+Hot-Swappable+Switc&p=0.3409&c=%24) |
| Kailh PG1353-compatible hot-swap sockets | 20 | 30 | 10 | [ChiBox](https://chibox.app/products/p-813551952580?n=Kaihua+Kailh+hot-swappable+switch+socket+adapter+modified+plug-in+mechanical+choc+low+profile+switch&p=0.0727&c=%24) |
| EC11 vertical rotary encoder with push switch, 12 mm full shaft | 1 | 3 | 2 | [ChiBox](https://chibox.app/products/p-978134519093?n=EC11+rotary+encoder+15MM+digital+potentiometer+EC11+encoder+5+feet+with+switch+20mm+plum+blossom+sha&p=0.2659&c=%24) |
| 1N4148 axial diodes, DO-35 | 20 | 1 pack (100) | 80 | [ChiBox](https://chibox.app/products/p-984740882379?n=Risym+switching+diode+1N4148+IN4148+switching+tube+direct+plug+DO-35+tape+packaging+100+pieces&p=0.95&c=%24) |
| DSA low-profile dome keycaps, 1u MX cross mount | 20 | 20 | 0 | [ChiBox](https://chibox.app/products/p-730718564588?n=DSA+Keycaps+Low+Profile+Dome+Mechanical+Keyboard+Keycaps+Multicolor+1u%2F1.25u%2F1.5u%2F2u+Blind+Spot+Keyc&p=0.1023&c=%24) |

## PCB and case

| Item | Specification |
|---|---|
| PCB | JLCPCB, 5 boards, 2 layers, 1.6 mm FR-4, black or white solder mask |
| Case | Local 3D print, PLA or PETG |
| Feet | 4 thin self-adhesive rubber feet, preferably about 1 mm thick |
| Cable | USB-C data cable |

## Locked compatibility requirements

- Buy the RP2040-Zero **without installed headers**. It must match the PCB's 18 x 23.5 mm Waveshare-compatible outline, castellated-pad order, and top-mounted USB-C position.
- The switch selection must be the **PG1353 tactile / Black Tea** variant with an MX-style cross stem. Confirm the variant shown in the ChiBox cart before checkout.
- The sockets must be the matching **Kailh Choc/PG1353 low-profile hot-swap** type, not an MX hot-swap socket.
- Select a **vertical five-pin EC11 with push switch and 12 mm full shaft**. The linked product title mentions multiple shaft sizes/styles, so verify the selected cart variant. The PCB's elongated anchor slots accept common EC11 and PEC11R tab spacings, but the pin geometry must be checked against the 100% print.
- The diodes must be axial **1N4148 in DO-35 packaging**, not an SMD version.
- Select the linked listing's **1u** option with an **MX cross mount**. The listing covers multiple sizes and colors, so verify the cart variant before checkout. Test one cap first: PG1353 stem engagement and the keycap skirt's clearance over the low-profile switch must still be confirmed physically.

## Cost snapshot supplied with this BOM

| Item | Estimated cost |
|---|---:|
| ChiBox products | $21.18 |
| China local delivery | $3.78 |
| Sea freight | $4.82 |
| Delivered to Lebanon | about $29.78 |
| JLCPCB, 5 boards | about $5 |
| Local printed case | about $5–15 |
| Complete project | about $40–50 |

The older custom [`assets/keycap.stl`](assets/keycap.stl) remains in the project only as an optional print-fit prototype; it is not part of this locked purchasing BOM.
