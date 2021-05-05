// documentation: https://developer.sketchapp.com/reference/api/
import sketch from 'sketch'
import dialog from '@skpm/dialog'

import {chooseDirectory, createScratchArtboard} from './util';

const {
  Shape,
  Rectangle,
} = sketch


function isBackgroundNode(node) {
  return node.name.toLowerCase().includes('background')
}

/**
 * Recursively transform nodes to be suitable for export as iconfont SVGs.
 */
function transformNodesForExport(nodes) {
  for (let node of (nodes || [])) {
    switch (node.type) {
      case 'SymbolInstance': {
        if (isBackgroundNode(node)) {
          node.sketchObject.isVisible = false
        } else {
          transformNodesForExport([node.detach()])
        }
        break
      }
      case 'Group': {
        transformNodesForExport(node.layers)
        // Union child layers together.
        const combinedShape = new Shape({
          frame: new Rectangle(node.frame),
          name: 'Combined shape',
          parent: node,
          layers: node.layers.filter(layer => layer.type === 'Shape'),
          style: {
            fills: [{color: '#000'}],
            borders: [],
          }
        })
        combinedShape.layers.forEach(layer => {
          layer.sketchObject.setBooleanOperation(0)
        })
        break
      }
      case 'ShapePath':
        node.sketchObject.layersByConvertingToOutlines()
        break
      case 'Shape': {
        if (isBackgroundNode(node)) {
          node.sketchObject.isVisible = false
        }
        node.layers.forEach(layer => {
          layer.sketchObject.setBooleanOperation(0)
        })
        break
      }
    }
  }
}

export default function() {
  const document = sketch.getSelectedDocument()
  const selectedLayers = document.selectedLayers
  const selectedCount = selectedLayers.length

  if (selectedCount === 0) {
    sketch.UI.message('No layers are selected, nothing to do')
  } else {
    const paths = dialog.showOpenDialogSync(document, {
      title: 'Select export folder…',
      properties: [
        'openDirectory',
        'createDirectory',
      ],
    })
    if (paths.length !== 1) {
      sketch.UI.message('Cancelled')
      return
    }

    const output = paths[0]
    sketch.UI.message('Preparing ' + selectedCount + ' object(s)…')
    let tmpArtboard = createScratchArtboard(document.selectedPage)
    let layers = selectedLayers.layers.map(layer => {
      let copy = layer.duplicate()
      copy.parent = tmpArtboard
      return copy;
    })
    tmpArtboard.adjustToFit()
    transformNodesForExport(layers)

    const exportLayers = tmpArtboard.layers.filter(layer => layer.type === 'Group')
    sketch.export(exportLayers, {formats: 'svg', output})
    sketch.UI.message('Exported ' + exportLayers.length.toString() + ' assets to ' + output)
    tmpArtboard.remove()
  }

}
