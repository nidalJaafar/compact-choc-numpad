// Horizontal DO-35 footprint for 1N4148, using a beginner-friendly 7.62 mm pitch.
// Vishay specifies a 3.4 mm max body length and 1.75 mm max diameter.

module.exports = {
  params: {
    designator: 'D',
    side: 'B',
    from: { type: 'net', value: undefined },
    to: { type: 'net', value: undefined },
  },
  body: p => {
    const mirror = p.side === 'B' ? ' (justify mirror)' : ''
    return `
  (footprint "Diode_THT:D_DO-35_SOD27_P7.62mm_Horizontal"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 -1.8 ${p.r}) (layer "${p.side}.SilkS") ${p.ref_hide}
      (effects (font (size 0.8 0.8) (thickness 0.12))${mirror})
    )
    (property "Value" "1N4148"
      (at 0 1.8 ${p.r}) (layer "${p.side}.Fab") (hide yes)
      (effects (font (size 0.8 0.8) (thickness 0.12))${mirror})
    )
    (attr through_hole)
    (fp_rect (start -1.7 -0.875) (end 1.7 0.875)
      (stroke (width 0.15) (type solid)) (fill none) (layer "${p.side}.SilkS"))
    (fp_line (start -1.1 -0.875) (end -1.1 0.875)
      (stroke (width 0.3) (type solid)) (layer "${p.side}.SilkS"))
    (fp_line (start -3.81 0) (end -1.7 0)
      (stroke (width 0.15) (type solid)) (layer "${p.side}.Fab"))
    (fp_line (start 1.7 0) (end 3.81 0)
      (stroke (width 0.15) (type solid)) (layer "${p.side}.Fab"))
    (pad "1" thru_hole rect (at -3.81 0 ${p.r}) (size 1.8 1.8) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.to})
    (pad "2" thru_hole circle (at 3.81 0 ${p.r}) (size 1.8 1.8) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.from})
  )
  (segment (start ${p.eaxy(3.81, 0)}) (end ${p.eaxy(5.745, 0)})
    (width 0.25) (layer "B.Cu") (net ${p.from.index}))
  (segment (start ${p.eaxy(5.745, 0)}) (end ${p.eaxy(5.745, -11.25)})
    (width 0.25) (layer "B.Cu") (net ${p.from.index}))`
  }
}
