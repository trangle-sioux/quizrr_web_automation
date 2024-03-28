import { readFileSync } from 'fs';
import { GRAPHQL_QUERY } from '../../../../constants';
import * as util from 'util';

function getQueryUserPath() {
  return util.format(GRAPHQL_QUERY, 'user', 'query');
}
function getQueryUserVariablePath() {
  return util.format(GRAPHQL_QUERY, 'user', 'variables');
}

export function readQueryUserContent() {
  return readFileSync(getQueryUserPath(), 'utf8');
}
export function readQueryUserVariablesContent() {
  return readFileSync(getQueryUserVariablePath(), 'utf8');
}
