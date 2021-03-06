import React from "react";
import { createBrowserHistory } from "history";

// This creates a singleton that holds the context to
// browser history. Import this to manipulate history,
// including pushing and popping.
// https://github.com/ReactTraining/history/tree/master/docs
// If you want to navigate between pages, use the Link
// component below.
const history = createBrowserHistory();
export default history;

export const Link = ({
  children,
  href,
  inline = false,
  hideTextDecoration = false,
  selected = false,
  ...props
}) => (
  <a
    className={`text-button 
      ${inline ? "text-button-inline" : ""} 
      ${hideTextDecoration ? "text-button-stealth" : ""} 
      ${selected ? "text-button-selected" : ""} `}
    href={href}
    onClick={(e) => {
      e.preventDefault();
      history.push(href);
    }}
    {...props}
  >
    {children}
  </a>
);

export function goTo(href) {
  history.push(href);
}

export const LinkButton = ({ children, href, ...props }) => (
  <button
    href={href}
    onClick={(e) => {
      e.preventDefault();
      history.push(href);
    }}
    {...props}
  >
    {children}
  </button>
);
