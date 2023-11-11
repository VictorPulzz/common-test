import { ApolloClient, from, InMemoryCache } from '@apollo/client';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/extensions
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

import { gqlConfig } from './config';
import { createAuthLink } from './links/createAuthLink';
import { createErrorLink } from './links/createErrorLink';
import { GqlConfig } from './types';

export function createGqlClient(config: GqlConfig): ApolloClient<unknown> {
  Object.assign(gqlConfig, config);

  gqlConfig.client = new ApolloClient({
    link: from([
      createErrorLink(gqlConfig),
      createAuthLink(gqlConfig),
      createUploadLink({ uri: gqlConfig.serverUrl }),
    ]),
    cache: new InMemoryCache(gqlConfig.cache),
  });

  return gqlConfig.client;
}
