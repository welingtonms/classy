# variantify
This library helps you to handle assigning style to multiple combination os variations.

## What problem do we want to solve here?

Let's say you have a React component with props such as `colorScheme`, `variant`, `validationStatus`, `disabled`, and so on.

If you to style your component conditionally according to these props, you would have to write something like:

```jsx
  import clsx from 'clsx'

  // ...
  const { colorScheme, variant, validationStatus, disabled } = props

  <Button
    className={clsx({
      'some class combination a': colorScheme == 'dark' && variant == 'primary',
      'some class combination b': colorScheme == 'light' && variant == 'secondary' && validationStatus == 'valid'
      'some class combination c': colorScheme == 'dark' && variant == 'terciary' 
      'some class combination d': validationStatus == 'invalid' && colorScheme == 'light'
    })}
  >
    My Cool Button
  </Button>
```


Well, what if you could write something like:

```jsx
  import clsx from 'clsx'

  // ...
  const combine = variantify({
    scheme: ['light', 'dark'],
    variant: ['primary', 'secondary', 'terciary'],
    status: ['success', 'danger', 'warn', 'neutral'],
  })

  const { colorScheme, variant, validationStatus, disabled } = props

  <Button
    className={clsx({
      'some class combination a': colorScheme == 'dark' && variant == 'primary',
      'some class combination b': colorScheme == 'light' && variant == 'secondary' && validationStatus == 'valid'
      'some class combination c': colorScheme == 'dark' && variant == 'terciary' 
      'some class combination d': validationStatus == 'invalid' && colorScheme == 'light'
    },
    combine(['dark', 'primary'], 'some class combination a')(props),
    combine(['light', 'secondary', 'valid'], 'some class combination b')(props),
    combine(['dark', 'terciary'], 'some class combination c')(props),
    combine(['light', 'invalid'], 'some class combination d')(props),
   )}
  >
    My Cool Button
  </Button>
```
