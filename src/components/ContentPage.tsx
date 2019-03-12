import React from 'react';

import { ContentContext, ContentContext2  } from '../context';
import { ContentType, ContentType2 } from '../content';
import { consumeContexts } from '../hocs/';

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
