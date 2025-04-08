function isArrayOfStrings(value: any): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

export default isArrayOfStrings;
