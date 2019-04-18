import React from 'react';

type SignatureOf<T> = T extends (...args: infer R) => infer S ? [R, S] : never; // Extract args and return into a tuple [args, returnvalue]
type FunctionLike<T> = (...args: SignatureOf<T>[0]) => SignatureOf<T>[1]; // A function which is assignable to T

export type ContextLike<T> = {
  Provider: FunctionLike<React.Context<T>['Provider']>;
  Consumer: FunctionLike<React.Context<T>['Consumer']>;
};

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
