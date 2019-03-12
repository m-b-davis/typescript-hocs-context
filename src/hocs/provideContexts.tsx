import React from 'react';

// HOC to inject context providers
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
