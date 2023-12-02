import Image from 'next/image'
import {
  Button,
  FluentProvider,
  webLightTheme,
} from '@fluentui/react-components'

export default function Home() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Button appearance="primary">Hello Fluent UI React</Button>
    </FluentProvider>
  );
}
