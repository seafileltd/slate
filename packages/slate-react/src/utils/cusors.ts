import { NodeEntry, Range, Path, Text } from '@seafile/slate'
import { Cursors } from '../cursor'

export const hasCursors = (cursors: Cursors, node: NodeEntry): Boolean => {
  const [, path] = node
  if (!cursors) return false
  return cursors.some(cursor => {
    if (Range.includes(cursor, path)) return true
    return false
  })
}

export const decorateCursors = (
  cursors: Cursors,
  nodeEntry: NodeEntry
): Range[] => {
  if (!cursors) return []
  const ranges: Range[] = []
  const [node, path] = nodeEntry
  if (Text.isText(node) && cursors?.length) {
    cursors.forEach(cursor => {
      if (Range.includes(cursor, path)) {
        const { focus, anchor } = cursor

        const isFocusNode = Path.equals(focus.path, path)
        const isAnchorNode = Path.equals(anchor.path, path)

        ranges.push({
          ...cursor,
          isCaret: isFocusNode,
          anchor: {
            path,
            offset: isAnchorNode ? anchor.offset : node.text.length,
          },
          focus: {
            path,
            offset: isFocusNode ? focus.offset : 0,
          },
        })
      }
    })
  }
  return ranges
}
