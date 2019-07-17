import 'reflect-metadata';

const diceKey = Symbol('dice');

export function dice(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  console.log((<Function>target).arguments);
  console.log(propertyKey, parameterIndex);
  let diceParams: string[] =
    Reflect.getOwnMetadata(diceKey, target, propertyKey) || [];

  //   existingRequiredParameters.push(parameterIndex);
  //   Reflect.defineMetadata(
  //     diceKey,
  //     existingRequiredParameters,
  //     target,
  //     propertyKey
  //   );
}
