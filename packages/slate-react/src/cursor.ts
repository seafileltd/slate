import { Point } from '@seafile/slate'

export interface Cursor {
  anchor: Point
  focus: Point
  color: string
  name: string
}

export type Cursors = Cursor[] | null | undefined
