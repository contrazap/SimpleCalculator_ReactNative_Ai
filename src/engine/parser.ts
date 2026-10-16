import { CalcError, type Node, type Token } from './types';

/**
 * Recursive-descent parser.
 *
 *   expression := term (("+" | "−") term)*
 *   term       := unary (("×" | "÷") unary | implicit-times)*
 *   unary      := "−" unary | postfix
 *   postfix    := primary "%"*
 *   primary    := number | "(" expression ")"
 *
 * implicit-times covers "2(3)" and "(2)3": a number or "(" directly after a
 * complete factor multiplies it.
 */
export function parse(tokens: Token[]): Node {
  let position = 0;

  const peek = (): Token | undefined => tokens[position];
  const next = (): Token | undefined => tokens[position++];

  function parseExpression(): Node {
    let left = parseTerm();
    for (;;) {
      const token = peek();
      if (
        token?.type !== 'operator' ||
        (token.operator !== 'plus' && token.operator !== 'minus')
      ) {
        return left;
      }
      next();
      left = {
        type: 'binary',
        operator: token.operator,
        left,
        right: parseTerm(),
      };
    }
  }

  function parseTerm(): Node {
    let left = parseUnary();
    for (;;) {
      const token = peek();
      if (
        token?.type === 'operator' &&
        (token.operator === 'times' || token.operator === 'divide')
      ) {
        next();
        left = {
          type: 'binary',
          operator: token.operator,
          left,
          right: parseUnary(),
        };
      } else if (token?.type === 'number' || token?.type === 'openParen') {
        left = { type: 'binary', operator: 'times', left, right: parseUnary() };
      } else {
        return left;
      }
    }
  }

  function parseUnary(): Node {
    const token = peek();
    if (token?.type === 'operator' && token.operator === 'minus') {
      next();
      return { type: 'negate', operand: parseUnary() };
    }
    return parsePostfix();
  }

  function parsePostfix(): Node {
    let node = parsePrimary();
    while (peek()?.type === 'percent') {
      next();
      node = { type: 'percent', operand: node };
    }
    return node;
  }

  function parsePrimary(): Node {
    const token = next();
    if (token?.type === 'number') {
      return { type: 'number', value: token.value };
    }
    if (token?.type === 'openParen') {
      const inner = parseExpression();
      if (next()?.type !== 'closeParen') {
        throw new CalcError('SYNTAX', 'Missing closing parenthesis');
      }
      return inner;
    }
    throw new CalcError('SYNTAX', 'Expected a number');
  }

  if (tokens.length === 0) throw new CalcError('SYNTAX', 'Empty expression');
  const tree = parseExpression();
  if (position < tokens.length) {
    throw new CalcError('SYNTAX', 'Unexpected input after expression');
  }
  return tree;
}
