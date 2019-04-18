### Playing with HOCs, Hooks, Context and the infer keyword in Typescript
This repo explores some more advanced typescript and react features for the purposes of learning.

The end result is two HOCs which can be used to provide and consume contexts. This keeps your component tree a little cleaner - components which should be concerned purely with displaying their markup no longer have to care about how they are passed their props.

We can also export components before wrapping them - to test without referring to context at all.

It's probably not the most performant solution - but also probably not the performance bottleneck in an app!

### Summary: 

Create replica context type (for constructing custom context provider/consumers which match the react API as these can't be assigned to React.Context<T>)

```ts
type SignatureOf<T> = T extends (...args: infer R) => infer S ? [R, S] : never; // Extract args and return into a tuple [args, returnvalue]
type FunctionLike<T> = (...args: SignatureOf<T>[0]) => SignatureOf<T>[1]; // A function which is assignable to T

export type ContextLike<T> = {
  Provider: FunctionLike<React.Context<T>['Provider']>;
  Consumer: FunctionLike<React.Context<T>['Consumer']>;
};

```

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
export type ProvideContext<T> = [ContextLike<T>, T?];

export default function provideContexts<BaseProps>(contexts: ProvideContext<any>[]) {
  const [[Context, value], ...remainingProviders] = Array.isArray(contexts) ? contexts : [contexts];
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
  };
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

// Multiple contexts
export default consumeContexts<ExternalProps>([
  ContentContext,
  ContentContext2
])(ContentPage);

// OR one context (no array)
export default consumeContexts<ExternalProps>(ContentContext)(ContentPage);
```

*Source:*
```ts

export default function consumeContexts<ExternalProps = {}>(contexts: ContextLike<any>[] | ContextLike<any>) {
  const [context, ...remainingContexts] = Array.isArray(contexts) ? contexts : [contexts];
  return (Child: React.ComponentType<any>): React.ComponentType<ExternalProps> => {
    const Wrapped = remainingContexts.length > 0
      ? consumeContexts<ExternalProps>(remainingContexts)(Child)
      : Child;

    const getProps = (props: ExternalProps) => ({
      ...useContext(context as React.Context<any>),
      ...props,
    });

    return props => <Wrapped {...getProps(props)} />;
  };
}

```



### Benefits:
 - Component unaware of context -> simpler component trees
 - Easier testing - export the component without the HOC and test without dependencies
  
### Future improvements: 
 - Get rid of use of any....