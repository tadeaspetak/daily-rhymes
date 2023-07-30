import * as Types from '../gql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SweetnessQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SweetnessQuery = { __typename?: 'Query', hello: string };


export const SweetnessDocument = gql`
    query Sweetness {
  hello
}
    `;

/**
 * __useSweetnessQuery__
 *
 * To run a query within a React component, call `useSweetnessQuery` and pass it any options that fit your needs.
 * When your component renders, `useSweetnessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSweetnessQuery({
 *   variables: {
 *   },
 * });
 */
export function useSweetnessQuery(baseOptions?: Apollo.QueryHookOptions<SweetnessQuery, SweetnessQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SweetnessQuery, SweetnessQueryVariables>(SweetnessDocument, options);
      }
export function useSweetnessLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SweetnessQuery, SweetnessQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SweetnessQuery, SweetnessQueryVariables>(SweetnessDocument, options);
        }
export type SweetnessQueryHookResult = ReturnType<typeof useSweetnessQuery>;
export type SweetnessLazyQueryHookResult = ReturnType<typeof useSweetnessLazyQuery>;
export type SweetnessQueryResult = Apollo.QueryResult<SweetnessQuery, SweetnessQueryVariables>;