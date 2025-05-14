import React from 'react';
import HelloBlock from './HelloBlock';

export const applyCustomCode = (externalCodeSetup) => {
  externalCodeSetup.blocksApi.addCustomBlockRender(
    'custom/hello-block',
    (props) => <HelloBlock {...props} />
  );
};
