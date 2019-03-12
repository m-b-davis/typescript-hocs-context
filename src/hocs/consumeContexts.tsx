import React from 'react';

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
