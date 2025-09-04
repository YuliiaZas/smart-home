export const createUrlRelatedToCurrentUrl = (segment: string, url: string, siblingRoute?: boolean): string => {
  const baseUrl = siblingRoute ? url.split('/').slice(0, -1).join('/') : url;
  return segment ? `${baseUrl}/${segment}` : baseUrl;
};
