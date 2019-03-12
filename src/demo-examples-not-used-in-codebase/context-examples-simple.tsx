import React from 'react';
import content from './content.json';

type Subtract<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

const MyContext: React.Context<ContextValues> = React.createContext(content);

const RegularContextPage = () => {
  return (
    <MyContext.Consumer>
      {content => (
        <>
          <h1>{content.title}</h1>
          {content.content.map(text => <p key={text}>{text}</p>)}
          <h5>{content.footer}</h5>
        </>
      )}
    </MyContext.Consumer>
  )
}

type ContextValues = typeof content;
type SubtractComponent<T, U> = React.ComponentType<Subtract<T, U>>;

function withContent<ComponentProps extends ContextValues>(Target: React.ComponentType<ComponentProps>): SubtractComponent<ComponentProps, ContextValues> {
  return (props: Subtract<ComponentProps, ContextValues>) => (
    <MyContext.Consumer>
      {contextValues => <Target {...{ ...props, ...contextValues } as ComponentProps} />}
    </MyContext.Consumer>
  );
}

type IndirectSubtract<T, U> = Pick<T, keyof Subtract<T, U>>;
type IndirectSubtractComponent<T, U> = React.ComponentType<IndirectSubtract<T, U>>;

function injectContext<ComponentProps extends ContextType, ContextType>(Context: React.Context<ContextType>) {
  return (Target: React.ComponentType<ComponentProps>): SubtractComponent<ComponentProps, ContextType> =>
    props => (
      <Context.Consumer>
        {contextValues => <Target {...{ ...props, ...contextValues } as ComponentProps} />}
      </Context.Consumer>
    );
}

type MyContextInjector<ComponentProps extends ContextValues> =
    (Target: React.ComponentType<ComponentProps>) => SubtractComponent<ComponentProps, ContextValues>;

type ContextInjector<ComponentProps extends ContextType, ContextType> =
  (Context: React.Context<ContextType>) =>
    (Target: React.ComponentType<ComponentProps>) => IndirectSubtractComponent<ComponentProps, ContextType>;


type Props = ContextValues;

const WithContentPage = (content: Props) => <>
  <h1>{content.title}</h1>
  {content.content.map(text => <p key={text}>{text}</p>)}
  <h5>{content.footer}</h5>
</>;


const WrappedWithContentPage = withContent(WithContentPage);

const withContent2 = injectContext(MyContext);
const WrappedWithContextInjectorPage = withContent2(WithContentPage);


const App = () => {
  return (
    <MyContext.Provider value={content}>
      <RegularContextPage />
      <WrappedWithContextInjectorPage />
    </MyContext.Provider>
  )
};
