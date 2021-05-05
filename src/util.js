import sketch from 'sketch'

const NEW_ARTBOARD_OFFSET = 50

function findNewArtboardCoords(page) {
  const [x, y] = page.layers.reduce(([ox, oy], layer) => {
    const x = layer.frame.x + layer.frame.width
    const y = layer.frame.y
    return [(x > ox ? x : ox), (y < oy ? y : oy)]
  }, [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY])
  return [x + NEW_ARTBOARD_OFFSET, y]
}

export function createScratchArtboard(parentPage) {
  const artboard = new sketch.Artboard({
    name: 'Scratch',
    parent: parentPage,
  })
  const newFrame = artboard.frame.changeBasis({
    from: artboard,
    to: artboard.parent,
  })
  const [x, y] = findNewArtboardCoords(parentPage)
  newFrame.x = x
  newFrame.y = y
  artboard.frame = newFrame
  return artboard
}