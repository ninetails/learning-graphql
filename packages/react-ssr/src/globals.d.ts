import 'react/experimental'
import 'react-dom/experimental'

declare module '@xstyled/emotion' {
  import styled from '@emotion/styled'
  export * from '@emotion/core'
  export * from '@emotion/styled'

  export default styled
}
