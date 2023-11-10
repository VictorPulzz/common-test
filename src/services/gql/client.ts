import { ApolloClient, from, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

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
