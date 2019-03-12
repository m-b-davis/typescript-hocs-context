import React from 'react';

import content from './content.json';
import content2 from './content2.json';

type Subtract<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

type ContentValues = typeof content;
type ContentValues2 = typeof content2;

const MyContext = React.createContext(content);
const MyContext2 = React.createContext(content2);

const injectContext = <ComponentProps extends ContextProps, ContextProps>(Context: React.Context<ContextProps>) =>
  (Component: React.ComponentType<ComponentProps>): React.ComponentType<Pick<ComponentProps, keyof Subtract<ComponentProps, ContextProps>>> =>
    props => (
      <Context.Consumer>
        {contextProps => <Component {...{ ...props, ...contextProps } as ComponentProps} />}
      </Context.Consumer>
    );

const withSomeContent = injectContext(MyContext);
const withSomeOtherContent = injectContext(MyContext2);

type ExternalProps = { extraProp: string };
type InjectedProps = ContentValues & ContentValues2;
type Props = InjectedProps & ExternalProps;

const ContentPage = (content: Props) => <>
  <h1>{content.title}</h1>
  {content.content.map(text => <p key={text}>{text}</p>)}
  <h5>{content.footer}</h5>
</>;


// Not working in TS 3.3
// const WrappedContentPage = withSomeContent(withSomeOtherContent(ContentPage)); // :(

// const App = () => (
//   <>
//     <WrappedContentPage extraProp="hello" />
//   </>
// );