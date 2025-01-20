# Code of Conduct

## Interface Concepts

### Field

1. A Field must contain [Field Head](#field-head) and [Field Body](#field-body).
2. A Field must be a direct child of a document body.
3. A Field cannot contain another Field.

#### Field Head

1. A Field Head may contain one or two buttons at top-right or top-left corner.
2. A Field Head may contain a title.

#### Field Body

1. A Field Body must be a direct child of a [Field](#field).
2. A Field Body can contain [Components](#component).

### Component

1. A Component must be inside a [Field Body](#field-body).
2. A Component can contain another Component.
3. A Component can contain [Elements](#element) or [Items](#item).
4. A Component may have an "animation" attribute.

### Item

1. An Item must be inside a [Component](#component).
2. An Item usually comes in listing context.
3. An Item may have a "skeleton-screen" attribute.

### Element

1. An Element can contain Elements.
