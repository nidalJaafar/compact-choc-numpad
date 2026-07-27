// Universal vertical EC11/PEC11R footprint with push switch.
// Electrical pins match Bourns PEC11R and common five-pin EC11 parts. The
// widened NPTH mounting slots accept both the 11.2 mm common EC11 tab spacing
// and the 13.2 mm Bourns PEC11R tab spacing.

module.exports = {
  params: {
    designator: 'ENC',
    side: 'F',
    A: { type: 'net', value: 'ENC_A' },
    B: { type: 'net', value: 'GND' },
    C: { type: 'net', value: 'ENC_B' },
    S1: { type: 'net', value: 'ENC_SW' },
    S2: { type: 'net', value: 'GND' },
  },
  body: p => `
  (footprint "Encoder:EC11-PEC11R-Universal"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 -9 ${p.r})
      (layer "${p.side}.SilkS")
      ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (property "Value" "EC11-15mm-D-Push"
      (at 0 0 ${p.r})
      (layer "${p.side}.Fab")
      (hide yes)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr through_hole)

    (fp_rect (start -6.25 -6.7) (end 6.25 6.7)
      (stroke (width 0.15) (type solid)) (fill none) (layer "${p.side}.Fab"))
    (fp_circle (center 0 0) (end 3.5 0)
      (stroke (width 0.15) (type solid)) (fill none) (layer "${p.side}.Fab"))
    (fp_text user "A  C  B" (at 0 9 ${p.r}) (layer "${p.side}.SilkS")
      (effects (font (size 0.8 0.8) (thickness 0.12))))

    (pad "A" thru_hole circle (at -2.5 7.5 ${p.r}) (size 1.8 1.8) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.A})
    (pad "B" thru_hole circle (at 0 7.5 ${p.r}) (size 1.8 1.8) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.B})
    (pad "C" thru_hole circle (at 2.5 7.5 ${p.r}) (size 1.8 1.8) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.C})
    (pad "S1" thru_hole circle (at -2.5 -7 ${p.r}) (size 1.8 1.8) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.S1})
    (pad "S2" thru_hole circle (at 2.5 -7 ${p.r}) (size 1.8 1.8) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.S2})

    (pad "" np_thru_hole oval (at -6.05 0 ${p.r}) (size 4.2 2.0) (drill oval 4.0 1.8) (layers "*.Cu" "*.Mask"))
    (pad "" np_thru_hole oval (at 6.05 0 ${p.r}) (size 4.2 2.0) (drill oval 4.0 1.8) (layers "*.Cu" "*.Mask"))
  )`
}
