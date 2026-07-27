// Waveshare RP2040-Zero castellated module footprint for Ergogen v4.
// Board size and pad locations follow Waveshare's official 18 x 23.5 mm
// mechanical drawing. USB-C is at the local negative-Y (rear) edge.

module.exports = {
  params: {
    designator: 'MCU',
    side: 'F',
    GP0: { type: 'net', value: '' }, GP1: { type: 'net', value: '' },
    GP2: { type: 'net', value: '' }, GP3: { type: 'net', value: '' },
    GP4: { type: 'net', value: '' }, GP5: { type: 'net', value: '' },
    GP6: { type: 'net', value: '' }, GP7: { type: 'net', value: '' },
    GP8: { type: 'net', value: '' }, GP9: { type: 'net', value: '' },
    GP10: { type: 'net', value: '' }, GP11: { type: 'net', value: '' },
    GP12: { type: 'net', value: '' }, GP13: { type: 'net', value: '' },
    GP14: { type: 'net', value: '' }, GP15: { type: 'net', value: '' },
    GP17: { type: 'net', value: '' }, GP18: { type: 'net', value: '' },
    GP19: { type: 'net', value: '' }, GP20: { type: 'net', value: '' },
    GP21: { type: 'net', value: '' }, GP22: { type: 'net', value: '' },
    GP23: { type: 'net', value: '' }, GP24: { type: 'net', value: '' },
    GP25: { type: 'net', value: '' }, GP26: { type: 'net', value: '' },
    GP27: { type: 'net', value: '' }, GP28: { type: 'net', value: '' },
    GP29: { type: 'net', value: '' },
    GND: { type: 'net', value: 'GND' },
    V3V3: { type: 'net', value: '3V3' },
    V5V: { type: 'net', value: '5V' },
  },

  body: p => {
    const left = [
      ['5V', p.V5V], ['GND', p.GND], ['3V3', p.V3V3],
      ['GP29', p.GP29], ['GP28', p.GP28], ['GP27', p.GP27],
      ['GP26', p.GP26], ['GP15', p.GP15], ['GP14', p.GP14],
    ];
    const right = [
      ['GP0', p.GP0], ['GP1', p.GP1], ['GP2', p.GP2],
      ['GP3', p.GP3], ['GP4', p.GP4], ['GP5', p.GP5],
      ['GP6', p.GP6], ['GP7', p.GP7], ['GP8', p.GP8],
    ];
    const bottom = [
      ['GP13', p.GP13], ['GP12', p.GP12], ['GP11', p.GP11],
      ['GP10', p.GP10], ['GP9', p.GP9],
    ];
    const edgePad = (name, net, x, y, rotation = 0) => `
    (pad "${name}" smd roundrect
      (at ${x} ${y} ${p.r + rotation})
      (size 2.4 1.65)
      (layers "${p.side}.Cu" "${p.side}.Paste" "${p.side}.Mask")
      (roundrect_rratio 0.25)
      ${net.str}
    )`;
    const pads = [
      ...left.map(([name, net], i) => edgePad(name, net, -8.65, -10.16 + i * 2.54)),
      ...right.map(([name, net], i) => edgePad(name, net, 8.65, -10.16 + i * 2.54)),
      ...bottom.map(([name, net], i) => edgePad(name, net, -5.08 + i * 2.54, 11.4, 90)),
    ].join('');

    return `
  (footprint "Waveshare:RP2040-Zero"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}" (at 0 13.5 ${p.r})
      (layer "${p.side}.SilkS") ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15))))
    (property "Value" "Waveshare RP2040-Zero" (at 0 0 ${p.r})
      (layer "${p.side}.Fab") (hide yes)
      (effects (font (size 1 1) (thickness 0.15))))
    (attr smd)
    (fp_rect (start -9 -11.75) (end 9 11.75)
      (stroke (width 0.15) (type solid)) (fill none) (layer "${p.side}.Fab"))
    (fp_rect (start -5.2 -14.4) (end 5.2 -9.7)
      (stroke (width 0.15) (type solid)) (fill none) (layer "Dwgs.User"))
    (fp_text user "USB-C" (at 0 -13.1 ${p.r}) (layer "${p.side}.SilkS")
      (effects (font (size 0.8 0.8) (thickness 0.12))))
    (fp_rect (start -9.5 -12.25) (end 9.5 12.25)
      (stroke (width 0.05) (type solid)) (fill none) (layer "${p.side}.CrtYd"))
    ${pads}
  )`;
  },
};
