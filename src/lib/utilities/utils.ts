export function getSubstring(data: string, length: number): string {
  let shortenedData = '';
  if (data && data.length > length) {
    shortenedData = data.substring(0, length) + '..';
  } else {
    shortenedData = data;
  }
  return shortenedData;
}

export function getNested(theObject: any, path: string, separator: string): any {
  try {
    separator = separator || '.';
    return path.
    replace('[', separator).replace(']', '').
    split(separator).
    reduce((obj: any, property: string): any => {
        return obj[property];
      }, theObject
    );

  } catch (err) {
    return undefined;
  }
}

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function toString(value: any): string {
  return (value !== undefined && value !== null) ? `${value}` : '';
}

export function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min);
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

export function regExpEscape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function hasClassName(element: any, className: string): boolean {
  return element && element.className && element.className.split &&
    element.className.split(/\s+/).indexOf(className) >= 0;
}

if (typeof Element !== 'undefined' && !Element.prototype.closest) {
  // Polyfill for ie10+
  if (!Element.prototype.matches) {
    // IE uses the non-standard name: msMatchesSelector
    Element.prototype.matches = (Element.prototype as any).msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  Element.prototype.closest = function(s: string) {
    let el = this;
    if (!document.documentElement.contains(el)) {
      return null;
    }
    do {
      if (el.matches(s)) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

export function closest(element: HTMLElement, selector): HTMLElement | null {
  if (!selector) {
    return null;
  }

  return element.closest(selector);
}

// Helper function to get an element's exact position
export function getPosition(element: any) {
  let xPos = 0;
  let yPos = 0;

  while (element) {
    if (element.tagName === 'BODY') {
      // deal with browser quirks with body/window/document and page scroll
      const xScroll = element.scrollLeft || document.documentElement.scrollLeft;
      const yScroll = element.scrollTop || document.documentElement.scrollTop;

      xPos += (element.offsetLeft - xScroll + element.clientLeft);
      yPos += (element.offsetTop - yScroll + element.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (element.offsetLeft - element.scrollLeft + element.clientLeft);
      yPos += (element.offsetTop - element.scrollTop + element.clientTop);
    }

    element = element.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}
