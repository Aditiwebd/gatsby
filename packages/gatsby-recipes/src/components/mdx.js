import React from "react"
import { mdx as createElement, MDXProvider } from "@mdx-js/react"
import { useInput, useInputByKey } from "../renderer/input-provider"
import { useResource } from "../renderer/resource-provider"
import { useProvider } from "../renderer/provider-provider"

const transformCodeForEval = jsx => `${jsx}

  return React.createElement(MDXProvider, { components },
    React.createElement(MDXContent, props)
  );`

export default ({ children: srcCode, scope, components, ...props }) => {
  delete components.RecipeIntroduction
  delete components.Config
  const fullScope = {
    mdx: createElement,
    MDXProvider,
    React,
    ...components,
    components,
    props,
    useInput,
    useInputByKey,
    useResource,
    useProvider,
    ...scope,
  }
  const scopeKeys = Object.keys(fullScope)
  const scopeValues = Object.values(fullScope)

  const fn = new Function(...scopeKeys, transformCodeForEval(srcCode))

  return fn(...scopeValues)
}
