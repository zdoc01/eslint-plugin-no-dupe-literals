/**
 * `in-scope` rule definition
 * @type {Object}
 */
module.exports = {
  meta: {
    docs: {}
  },
  
  create(context) {
    // string --> [ { scope: AST, nodes: [ ASTNode, ... ] }, ... ]
    let map = new Map();

    function report(node) {
      context.report({
        data: { value: node.value },
        message: 'Duplicate string literal found "{{value}}"',
        node
      });
    }

    function reportDupeNode(nodes, node){
      if (nodes.length === 2) {
        // make sure we report the first occurance
        report(nodes[0]);
      }
      report(node);
    }

    function addDupeNode(nodes, node) {
      return nodes.concat([node]);
    }

    function addScope(scope, node, scopes) {
      return scopes.concat([{ scope, nodes: [ node ] }]);
    }

    function isValidValue(value) {
      return value.length > 0;
    }

    function formatValue(value) {
      if (typeof value === 'string') {
        // prevent newline whitespace false positives
        return value.trim();
      }
      return '';
    }

    function checkScopeForDupes(scope, node, mappedScopes) {
      let ret = {};
      mappedScopes.forEach((o) => {
        if (o.scope === scope) {
          ret = o;
          return false;
        }
      });

      return ret;
    }

    return {
      /**
       * Check each Literal occurrence for duplicates
       * at the scope level.
       * @param {ASTNode} node The Literal node
       */
      Literal: node => {
        const value = formatValue(node.value);
        console.log(value);
        if (isValidValue(value)) {
          const scope = context.getScope();
          let mappedScopes = map.get(value);

          if (mappedScopes) {
            const scopeWithDupes = checkScopeForDupes(scope, node, mappedScopes);

            if (Object.keys(scopeWithDupes).length) {
              // this literal is a duplicate, so save and report it
              scopeWithDupes.nodes = addDupeNode(scopeWithDupes.nodes, node);
              reportDupeNode(scopeWithDupes.nodes, node);
            } else {
              // add the occurrence of this literal for the current scope
              map.set(value, addScope(scope, node, mappedScopes));
            }
          } else {
            // brand new literal
            map.set(value, addScope(scope, node, []));
          }
        }
      }
    };
  }
};
