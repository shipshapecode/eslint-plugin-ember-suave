var utils = require('../../lib/utils/utils');

module.exports = {
  isDSModel: isDSModel,
  isModule: isModule,
  isEmberComponent: isEmberComponent,
  isEmberController: isEmberController,
  isInjectedServiceProp: isInjectedServiceProp,
  isObserverProp: isObserverProp,
  isObjectProp: isObjectProp,
  isArrayProp: isArrayProp,
  isComponentLifecycleHookName: isComponentLifecycleHookName,
  getModuleProperties: getModuleProperties,
};

// Private

function isLocalModule(callee, element) {
  return (utils.isIdentifier(callee) && callee.name === element) ||
    (utils.isIdentifier(callee.object) && callee.object.name === element);
}

function isEmberModule(callee, element, module) {
  memberExp = utils.isMemberExpression(callee.object) ? callee.object : callee;

  return isLocalModule(memberExp, module) &&
    utils.isIdentifier(memberExp.property) &&
    memberExp.property.name === element;
}

function isPropOfType(node, type) {
  var calleeNode = node.callee;

  return utils.isCallExpression(node) &&
    (
      utils.isIdentifier(calleeNode) &&
      calleeNode.name === type
    ) ||
    (
      utils.isMemberExpression(calleeNode) &&
      utils.isIdentifier(calleeNode.property) &&
      calleeNode.property.name === type
    );
}

// Public

function isModule(node, element, module) {
  module = module || 'Ember';

  return utils.isCallExpression(node) &&
    (isLocalModule(node.callee, element) || isEmberModule(node.callee, element, module));
}

function isDSModel(node) {
  return isModule(node, 'Model', 'DS');
}

function isEmberComponent(node) {
  return isModule(node, 'Component');
}

function isEmberController(node) {
  return isModule(node, 'Controller');
}

function isInjectedServiceProp(node) {
  return isPropOfType(node, 'service');
}

function isObserverProp(node) {
  return isPropOfType(node, 'observer');
}

function isArrayProp(node) {
  if (utils.isNewExpression(node.value)) {
    var parsedCallee = utils.parseCallee(node.value);
    return parsedCallee.pop() === 'A';
  }

  return utils.isArrayExpression(node.value);
}

function isObjectProp(node) {
  if (utils.isNewExpression(node.value)) {
    var parsedCallee = utils.parseCallee(node.value);
    return parsedCallee.pop() === 'Object';
  }

  return utils.isObjectExpression(node.value);
}

function isComponentLifecycleHookName(name) {
  var hooks = ['init', 'didReceiveAttrs', 'willRender', 'didInsertElement', 'didRender', 'didUpdateAttrs',
    'willUpdate', 'didUpdate', 'willDestroyElement', 'willClearRender', 'didDestroyElement'];

  return hooks.indexOf(name) !== -1;
}

function getModuleProperties(module) {
  return utils.findNodes(module.arguments, 'ObjectExpression')[0].properties;
}