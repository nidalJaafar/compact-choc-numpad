// Kailh Choc V2 hot-swap footprint for CPG135301D02 switches used with the
// CPG135001S30 socket. Pad and hole coordinates follow marbastlib's
// experimental SW_choc_v2_HS_CPG135001S30_1u footprint.
//
// Kailh only officially specifies CPG135001S30 for Choc V1. Verify this
// community V2 combination with physical parts before manufacturing.

module.exports = {
  params: {
    designator: 'SW',
    side: 'B',
    from: { type: 'net', value: undefined },
    to: { type: 'net', value: undefined },
  },
  body: p => {
    const side = p.side === 'F' ? 'F' : 'B'
    const mirror = side === 'B' ? ' (justify mirror)' : ''

    return `
  (footprint "marbastlib-xp-choc:SW_choc_v2_HS_CPG135001S30_1u"
    (layer "${side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 -8.6 ${p.r}) (layer "${side}.SilkS") ${p.ref_hide}
      (effects (font (size 0.8 0.8) (thickness 0.12))${mirror})
    )
    (property "Value" "CPG135301D02 + CPG135001S30"
      (at 0 8.6 ${p.r}) (layer "${side}.Fab") (hide yes)
      (effects (font (size 0.8 0.8) (thickness 0.12))${mirror})
    )
    (attr smd through_hole)

    (fp_rect (start -9.525 -9.525) (end 9.525 9.525)
      (stroke (width 0.1) (type solid)) (fill none) (layer "Dwgs.User"))
    (fp_rect (start -7.5 -7.5) (end 7.5 7.5)
      (stroke (width 0.12) (type solid)) (fill none) (layer "F.Fab"))
    (fp_rect (start -4.775 -2.925) (end 4.775 2.925)
      (stroke (width 0.12) (type solid)) (fill none) (layer "${side}.Fab"))
    (pad "" np_thru_hole circle (at 0 0 ${p.r})
      (size 5 5) (drill 5) (layers "*.Cu" "*.Mask"))

    (pad "1" thru_hole circle (at 5 -3.75 ${p.r})
      (size 3.3 3.3) (drill 3) (layers "*.Cu" "${side}.Mask") ${p.to})
    (pad "1" smd rect (at 6.55 -3.75 ${p.r})
      (size 1.2 2.6) (layers "${side}.Cu") ${p.to})
    (pad "1" smd roundrect (at 8.245 -3.75 ${p.r})
      (size 2.65 2.6) (layers "${side}.Cu" "${side}.Paste" "${side}.Mask")
      (roundrect_rratio 0.15) ${p.to})

    (pad "2" smd roundrect (at -3.245 -5.95 ${p.r})
      (size 2.65 2.6) (layers "${side}.Cu" "${side}.Paste" "${side}.Mask")
      (roundrect_rratio 0.15) ${p.from})
    (pad "2" smd rect (at -1.55 -5.95 ${p.r})
      (size 1.2 2.6) (layers "${side}.Cu") ${p.from})
    (pad "2" thru_hole circle (at 0 -5.95 ${p.r})
      (size 3.3 3.3) (drill 3) (layers "*.Cu" "${side}.Mask") ${p.from})

    (pad "MP" thru_hole circle (at -5 5.15 ${p.r})
      (size 2.4 2.4) (drill 1.6) (layers "*.Cu" "${side}.Mask"))
  )`
  }
}
