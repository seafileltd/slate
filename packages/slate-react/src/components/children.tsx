import React from 'react'
import { Editor, Range, Element, Ancestor, Node } from '@seafile/slate'

import ElementComponent from './element'
import { ReactEditor } from '../plugin/react-editor'
import { useSlateStatic } from '../hooks/use-slate-static'
import { useDecorate } from '../hooks/use-decorate'
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps'
import {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
} from '../components/editable'
import { SelectedContext } from '../hooks/use-selected'
import { hasCursors } from '../utils/cusors'
import { Cursors } from '../cursor'

/**
 * Children.
 */

const Children = (props: {
  decorations: Range[]
  node: Ancestor
  renderElement?: (props: RenderElementProps) => JSX.Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  selection: Range | null
  cursors?: Cursors
  composingNode?: Node | null | undefined
}) => {
  const {
    decorations,
    node,
    renderElement,
    renderPlaceholder,
    renderLeaf,
    selection,
    cursors,
    composingNode,
  } = props
  const decorate = useDecorate()
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, node)

  const children = []

  for (let i = 0; i < node.children.length; i++) {
    const p = path.concat(i)
    const n = node.children[i] as Element
    const key = ReactEditor.findKey(editor, n)
    const range = Editor.range(editor, p)
    const sel = selection && Range.intersection(range, selection)

    // decorate
    const ds = decorate([n, p])

    for (const dec of decorations) {
      const d = Range.intersection(dec, range)

      if (d) {
        ds.push(d)
      }
    }

    // cursors
    const hasCursor = hasCursors(cursors, [n, p])
    const childCursors = hasCursor ? cursors : null

    // placeholder
    const isComposing = composingNode?.id === n.id

    children.push(
      <SelectedContext.Provider key={`provider-${key.id}`} value={!!sel}>
        <ElementComponent
          decorations={ds}
          element={n}
          key={key.id}
          renderElement={renderElement}
          renderPlaceholder={renderPlaceholder}
          renderLeaf={renderLeaf}
          selection={sel}
          cursors={childCursors}
          isComposing={isComposing}
        />
      </SelectedContext.Provider>
    )

    NODE_TO_INDEX.set(n, i)
    NODE_TO_PARENT.set(n, node)
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default Children
