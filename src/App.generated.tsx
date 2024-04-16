import * as Types from '../types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetAllFilmsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllFilmsQuery = { __typename?: 'Query', launches?: Array<{ __typename?: 'Launch', details?: string | null, launch_date_utc?: any | null, launch_year?: string | null, mission_name?: string | null, rocket?: { __typename?: 'LaunchRocket', rocket_name?: string | null } | null } | null> | null };


export const GetAllFilmsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllFilms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"launches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"launch_date_utc"}},{"kind":"Field","name":{"kind":"Name","value":"launch_year"}},{"kind":"Field","name":{"kind":"Name","value":"mission_name"}},{"kind":"Field","name":{"kind":"Name","value":"rocket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rocket_name"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllFilmsQuery, GetAllFilmsQueryVariables>;