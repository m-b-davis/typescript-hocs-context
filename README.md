### Playing with HOCs and Context in Typescript
This repo was created for the purposes of a presentaiton and demo to my team.

This repo is for learning + fun purposes. Not to be taken seriously. 

### Summary: 

### provideContexts.tsx
Wraps up a parent component with the contexts you want to provide:

*Usage:*
```ts
const PageContainer = (props: PageContainerProps) => {
  return (
    <div style={{ width: '39%', margin: '100px auto' }}>
      <h1>{props.header}</h1>
      <ContentPage extraProp="hello" />
    </div>
  );
};

export default provideContexts<PageContainerProps>([
  [ContentContext, content],
  [ContentContext2, content2],
])(PageContainer);
```
*Source:*

```ts
export type ProvideContext<T> = [React.Context<T>, T?];

export default function provideContexts<BaseProps>([[Context, value], ...remainingProviders]: ProvideContext<any>[]) {
  return (Child: React.ComponentType<BaseProps>): React.ComponentType<BaseProps> => {
    const Wrapped = remainingProviders.length > 0
      ? provideContexts<BaseProps>(remainingProviders)(Child)
      : Child;

    // Use default value if not set
    const contextProps = value && { value };
    return (props: BaseProps) => (
      <Context.Provider {...contextProps}>
        <Wrapped {...props} />
      </Context.Provider>
    );
  }
}
```

### consumeContexts.tsx
Wraps up a child, pulling in required props from the contexts given

*Usage:*
```ts
type ExternalProps = { extraProp: string };
type InjectedProps = ContentType & Pick<ContentType2, 'title2' | 'footer2'>;

type Props = InjectedProps & ExternalProps;

const ContentPage = (props: Props) => <>
  <h1>From MyContext:</h1>
  <h2>Title: {props.title}</h2>
  <h2>Content: </h2>
    {props.content.map(text => <p key={text}>{text}</p>)}
  <h2>Footer: </h2>
  <h5>{props.footer}</h5>

  <h1>From MyContext2:</h1>
  <h2>Title2: {props.title2}</h2>

  <h2>Footer2: </h2>
  <h5>{props.footer2}</h5>

  <h1>Extra prop value: {props.extraProp}</h1>
</>;

export default consumeContexts<ExternalProps>([
  ContentContext,
  ContentContext2
])(ContentPage);
```

*Source:*
```ts
export default function consumeContexts<ExternalProps>([Context, ...remainingContexts]: React.Context<any>[]) {
  return (Child: React.ComponentType<any>): React.ComponentType<ExternalProps> => {
    const Wrapped = remainingContexts.length > 0 
      ? consumeContexts<ExternalProps>(remainingContexts)(Child)
      : Child;

    return (props: ExternalProps) => (
      <Context.Consumer>
        {context => <Wrapped {...{...context, ...props}} />}
      </Context.Consumer>
    );
  }
}
```

### Benefits:
 - Component unaware of context -> simpler component trees
 - Easier testing - export the component without the HOC and test without dependencies
  
