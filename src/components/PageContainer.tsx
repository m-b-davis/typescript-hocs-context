import React from 'react';

import ContentPage from './ContentPage';
import { provideContexts } from "../hocs";
import { ContentContext, ContentContext2 } from "../context";
import { content, content2 }from "../content";

interface PageContainerProps { 
  header: string;
}

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