

const isChildUrl = (parentUrl: string, childUrl: string): boolean => {
  // không tính trường hợp là / vì luôn là parentUrl
  if (parentUrl === '/admin') return parentUrl === childUrl;
  let compareParentUrl: string = parentUrl;
  let compareChildUrl: string = childUrl;

  if (!compareParentUrl.endsWith('/')) {
    compareParentUrl += '/';
  }
  if (!compareChildUrl.endsWith('/')) {
    compareChildUrl += '/';
  }
  return compareChildUrl.startsWith(compareParentUrl);
};

export default isChildUrl;