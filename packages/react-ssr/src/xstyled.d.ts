declare module '@xstyled/styled-components' {
  import styled, { StyledComponent, DefaultTheme } from 'styled-components'
  export * from 'styled-components'

  interface Breakpoints {
    xs: any
    sm: any
    md: any
    lg: any
    xl: any
  }

  type BreakpointObject<ArgType> = {
    [Key in keyof Breakpoints]?: ArgType
  }

  type WithBreakpointArgs<Props> = {
    [Key in keyof Props]?: Props[Key] | BreakpointObject<Props[Key]>
  }

  type FlexArgs =
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-around'
    | 'space-between'

  interface BoxPropsBase {
    /* Display */
    display:
    | 'block'
    | 'inline-block'
    | 'inline'
    | 'flex'
    | 'grid'
    | 'none'
    | 'inherit'
    | 'initial'
    /* Color */
    color: string
    backgroundColor: string
    /* Margins */
    margin: number
    m: number
    marginTop: number
    mt: number
    marginRight: number
    mr: number
    marginBottom: number
    mb: number
    marginLeft: number
    ml: number
    mx: number
    my: number
    /* Padding */
    padding: number
    p: number
    paddingTop: number
    pt: number
    paddingRight: number
    pr: number
    paddingBottom: number
    pb: number
    paddingLeft: number
    pl: number
    px: number
    py: number
    /* Space & Layout */
    space: number
    width: number | string
    /* Grid */
    row: boolean
    col: boolean | number
    /* Flex */
    justifyContent: FlexArgs
    alignItems: FlexArgs
  }

  /* adds support for { xs: arg } and makes all props optional */
  export type BoxProps = WithBreakpointArgs<BoxPropsBase>

  export const Box: StyledComponent<
  'div',
  DefaultTheme,
  WithBreakpointArgs<BoxProps>
  >
  export default styled
}
