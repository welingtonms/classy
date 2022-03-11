# classy

This library helps you to handle assigning style that relies on multiple combinations of `props` or conditionals.

[![Coverage Status](https://img.shields.io/coveralls/github/cheesebit/classy?style=flat-square)](https://coveralls.io/github/cheesebit/classy)
[![npm package](https://img.shields.io/npm/v/@cheesebit/classy?style=flat-square)](https://www.npmjs.com/package/@cheesebit/classy)

## What problem do we want to solve here?

Let's suppose you have some good old conditional classes to be applied to an element:

```jsx
  <Button
    className={`my-button ${disabled ? 'is-disabled' : ''}`}
  >
    My Cool Button
  </Button>
```

You could write:

```jsx
  import { classy } from 'clsx'

  <Button
    className={classy('my-button',{
      'is-disabled': disabled,
    })}
  >
    My Cool Button
  </Button>
```

Or, let's say you have a React component with props such as `colorScheme`, `variant`, `validationStatus`, `disabled`, and so on.

If you dare to style your component conditionally according to these props, you would have to write something like:

```jsx
  import clsx from 'clsx'

  const { colorScheme, variant, validationStatus, disabled } = props

  <Button
    className={clsx({
      'some class combination a': colorScheme == 'dark' && variant == 'primary',
      'some class combination b': (colorScheme == 'light' || colorScheme == 'dark') && variant == 'secondary' && validationStatus == 'valid',
      'some class combination c': colorScheme == 'dark' || variant == 'terciary',
      'some class combination d': !disabled
    })}
  >
    My Cool Button
  </Button>
```

Well, what if you could write something like:

```jsx
  import useClassy from '@cheesebit/classy'

  const { prop, classy } = useClassy(props)
  const { disabled } = props

  <Button
    className={classy({
      'some class combination a': prop({ colorScheme:'dark', variant == 'primary' }),
      'some class combination b': prop({ colorScheme: ['light', 'dark'], variant: 'secondary', validationStatus: 'valid' }),
      'some class combination c': prop([{ colorScheme: 'dark' }, { variant: 'terciary' }],
      'some class combination d': !disabled, // or prop({ disabled: false })
    })}
  >
    My Cool Button
  </Button>
```

Cool, huh?!

Or if you were using some CSS-in-JS library like [`styled-components`](https://styled-components.com/), you would have something like:

```jsx
import styled from 'styled-components'

const Button = styled.button`
  background: ${({ variant, scheme }) => ({
    '$button-primary-background': variant == 'primary',
    '$button-secondary-background': variant == 'secondary' && scheme == 'light',
    '$button-secondary-dark-background': variant == 'secondary' && scheme == 'dark',
    '$button-terciary-background': variant == 'terciary',
  })};

  border-color: ${({ variant, scheme }) => ({
    '$button-primary-border-color': variant == 'primary',
    '$button-secondary-border-color': variant == 'secondary' && scheme == 'light',
    '$button-secondary-dark-border-color': variant == 'secondary' && scheme == 'dark',
    '$button-terciary-border-color': variant == 'terciary',
  })};

  color: ${({ variant, scheme }) => ({
    '$button-primary-color': variant == 'primary',
    '$button-secondary-color': variant == 'secondary' && scheme == 'light',
    '$button-secondary-dark-color': variant == 'secondary' && scheme == 'dark',
    '$button-terciary-color': variant == 'terciary',
  })};
`
```

Well, what about something simpler like:

```jsx
import { classier, prop } from '@cheesebit/classy'

const Button = styled.button`
  background: ${classier({
    '$button-primary-background': prop({ variant: 'primary' }),
    '$button-secondary-background': prop({ variant: 'secondary', scheme: 'light' }),
    '$button-secondary-dark-background': prop({ variant: 'secondary', scheme: 'dark' }),
    '$button-terciary-background': prop({ variant: 'terciary' }),
  })};

  border-color: ${classier({
    '$button-primary-border-color': prop({ variant: 'primary' }),
    '$button-secondary-border-color': prop({ variant: 'secondary', scheme: 'light' }),
    '$button-secondary-dark-border-color': prop({ variant: 'secondary', scheme: 'dark' }),
    '$button-terciary-border-color': prop({ variant: 'terciary' }),
  })};

  color: ${classier({
    '$button-primary-color': prop({ variant: 'primary' }),
    '$button-secondary-color': prop({ variant: 'secondary', scheme: 'light' }),
    '$button-secondary-dark-color': prop({ variant: 'secondary', scheme: 'dark' }),
    '$button-terciary-color': prop({ variant: 'terciary' }),
  })};
`
```

`classy` gives you more power to represent conditionals and helps you declutter your styling, making it more purposeful.
