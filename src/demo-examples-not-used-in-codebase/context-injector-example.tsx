import React from 'react';

// Setup contexts
import content from './content.json';
import content2 from './content2.json';

type ContentValues = typeof content;
type ContentValues2 = typeof content2;

const MyContext = React.createContext(content);
const MyContext2 = React.createContext(content2);

// HOC to inject context providers
type ProvideContext<T> = [React.Context<T>, T?];

function provideContexts<BaseProps>([[Context, value], ...remainingProviders]: ProvideContext<any>[]) {
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

// HOC to inject context consumers

function consumeContexts<ExternalProps>([Context, ...remainingContexts]: React.Context<any>[]) {
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

// ContentPage.tsx
type ExternalProps = { extraProp: string };
type InjectedProps = ContentValues & Pick<ContentValues2, 'title2' | 'footer2'>;

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

const WrappedContentPage = consumeContexts<ExternalProps>([
  MyContext,
  MyContext2
])(ContentPage);


// AppContainer.tsx
interface AppContainerProps { 
  header: string;
}

const AppContainer = (props: AppContainerProps) => {
  return (
    <div style={{ width: '39%', margin: '100px auto' }}>
      <h1>{props.header}</h1>
      <WrappedContentPage extraProp="hello" />
    </div>
  );
};

const WrappedAppContainer = provideContexts<AppContainerProps>([
  [MyContext, content],
  [MyContext2, content2],
])(AppContainer);

// Root component
const Root = () => {
  return (
    <WrappedAppContainer header="hello"/>
  );
}

