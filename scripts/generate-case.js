#!/usr/bin/env node

const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const casesDir = path.join(root, 'output', 'cases')
const stlDir = path.join(root, 'output', 'stl')
const jscad = path.join(root, 'node_modules', '.bin', 'openjscad')
const parts = ['bottom_tray', 'top_cover']
const cedarSource = path.join(root, 'assets', 'cedar-traced.svg')
const beirutSource = path.join(root, 'assets', 'beirut-traced.svg')
const keyDeckDrop = 4.4
const keyRearBoundary = 88

function findImageMagick() {
  for (const command of ['magick', 'convert']) {
    const probe = spawnSync(command, ['-version'], { stdio: 'ignore' })
    if (!probe.error && probe.status === 0) return command
  }
  throw new Error('ImageMagick is required (expected `magick` or `convert`)')
}

const imageMagick = findImageMagick()

function parsePbm(output, label) {
  const tokens = output.replace(/#[^\n]*/g, '').trim().split(/\s+/)
  if (tokens.shift() !== 'P1') throw new Error(`Unexpected ${label} mask format`)
  return {
    width: Number(tokens.shift()),
    height: Number(tokens.shift()),
    pixels: tokens.map(Number),
  }
}

function maskToCutter(mask, identifier, targetWidth, centerX, centerY) {
  const pixelSize = targetWidth / mask.width
  const boxes = []
  for (let row = 0; row < mask.height; row += 1) {
    let column = 0
    while (column < mask.width) {
      while (column < mask.width && mask.pixels[row * mask.width + column] === 0) column += 1
      const start = column
      while (column < mask.width && mask.pixels[row * mask.width + column] === 1) column += 1
      if (start === column) continue
      const x = centerX + ((start + column) / 2 - mask.width / 2) * pixelSize
      const y = centerY - (row + 0.5 - mask.height / 2) * pixelSize
      const runWidth = (column - start) * pixelSize
      boxes.push(`translate([${x},${y},0.4], cube({size:[${runWidth + 0.015},${pixelSize + 0.015},0.8], center:true}))`)
    }
  }
  if (boxes.length === 0) throw new Error(`${identifier} mask was empty`)
  return `function ${identifier}_fn() { return union([${boxes.join(',\n')}]); }`
}

function addCoverEngravings(source) {
  const cedarMaskResult = spawnSync(imageMagick, [
    cedarSource, '-trim', '+repage', '-resize', '256x256',
    '-background', 'white', '-alpha', 'background',
    '-colorspace', 'Gray', '-threshold', '65%',
    '-compress', 'none', 'pbm:-',
  ], { encoding: 'utf8' })
  if (cedarMaskResult.status !== 0) throw new Error(cedarMaskResult.stderr || 'Failed to rasterize cedar')

  const beirutMaskResult = spawnSync(imageMagick, [
    beirutSource, '-trim', '+repage', '-resize', '320x174!',
    '-background', 'white', '-alpha', 'background',
    '-colorspace', 'Gray', '-threshold', '65%',
    '-compress', 'none', 'pbm:-',
  ], { encoding: 'utf8' })
  if (beirutMaskResult.status !== 0) throw new Error(beirutMaskResult.stderr || 'Failed to rasterize Beirut calligraphy')

  const cedarFunction = maskToCutter(parsePbm(cedarMaskResult.stdout, 'cedar'), 'lebanese_cedar_emblem', 24, 0, 99.25)
  const beirutFunction = maskToCutter(parsePbm(beirutMaskResult.stdout, 'Beirut calligraphy'), 'beirut_calligraphy', 29, 31.5, 99.25)
  const engravingFunctions = `${cedarFunction}\n${beirutFunction}`
  const steppedCoverFunction = `
function stepped_exposed_switch_cover_fn(cover) {
  // Keep the twenty individual switch holes and the plastic webs between
  // them, but lower the complete key deck by 4.4 mm. The rear artwork,
  // controller and encoder band stays at its original height.
  const keyRegion = translate([28.575, 29, 0], cube({size:[100, 118, 30], center:true}));
  const rearRegion = translate([28.575, 104, 0], cube({size:[100, 32, 30], center:true}));
  const keyDeck = cover.intersect(keyRegion).translate([0, 0, -${keyDeckDrop}]);
  const rearBand = cover.intersect(rearRegion);
  // Internal divider joins both levels while staying inside the locating lip
  // and clear of the last switch row and the rear-mounted electronics.
  const divider = translate([28.575, ${keyRearBoundary}, -0.6], cube({size:[77.5, 2, 7.6], center:true}));
  return union(keyDeck, rearBand, divider).translate([0, 0, ${keyDeckDrop}]);
}`
  const injectedFunctions = `${engravingFunctions}\n${steppedCoverFunction}`
  const withFunction = source.replace(/\n\s*function main\(\)/, `${injectedFunctions}\nfunction main()`)
  return withFunction.replace(
    'return top_cover_case_fn();',
    // Flip into assembled orientation, engrave the high rear band, then make
    // the key deck step. The final STL has its lowest locating lip at Z=0.
    'return stepped_exposed_switch_cover_fn(translate([0,0,3.2], scale([1,1,-1], top_cover_case_fn().subtract(lebanese_cedar_emblem_fn()).subtract(beirut_calligraphy_fn()))));',
  )
}

fs.mkdirSync(stlDir, { recursive: true })

for (const part of parts) {
  const source = path.join(casesDir, `${part}.jscad`)
  const target = path.join(stlDir, `${part}.stl`)
  let conversionSource = source
  let temporarySource

  if (!fs.existsSync(source)) {
    throw new Error(`Missing ${path.relative(root, source)}; run Ergogen first`)
  }

  if (part === 'top_cover') {
    temporarySource = path.join(os.tmpdir(), `compact-numpad-cover-${process.pid}.jscad`)
    fs.writeFileSync(temporarySource, addCoverEngravings(fs.readFileSync(source, 'utf8')))
    conversionSource = temporarySource
  }

  const result = spawnSync(jscad, [conversionSource, '-of', 'stla', '-o', target], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
  })
  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
  if (temporarySource) fs.unlinkSync(temporarySource)
  console.log(`Saved ${path.relative(root, target)}`)
}
