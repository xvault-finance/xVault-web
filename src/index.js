import React, { useState } from "react";
import ReactDOM from "react-dom";

import App from './App'
import * as serviceWorker from './serviceWorker'
import { IntlProvider } from 'react-intl';

import en from './i18n/en-us.js';
import zh_cn from './i18n/zh-cn.js';
import zh_tw from './i18n/zh-tw.js';

import './index.css'

// import pkg from 'semantic-ui-react/package.json'


// TODO: Switch to https://github.com/palmerhq/the-platform#stylesheet when it will be stable
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

const Root = () => {
  const [locale, setLocale] = useState(navigator.language);
  let messages;

  if (locale.includes('zh-tw')) {
    messages = zh_tw;
  } else if (locale.includes('zh-cn')) {
    messages = zh_cn;
  } else {
    messages = en;
  }

  return (
    <IntlProvider
      locale={locale}
      key={locale}
      defaultLocale="en-US"
      messages={messages}
    >
      <App setLocale={setLocale} />
    </IntlProvider>

  );
};

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();