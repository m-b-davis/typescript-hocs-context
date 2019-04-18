import React, { useContext } from 'react';
import { ContextLike } from './provideContexts';

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
