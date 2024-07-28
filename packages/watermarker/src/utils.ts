import {WatermarkConfigs} from "./type";

/** converting camel-cased strings to be lowercase and link it with Separato */
export function toLowercaseSeparator(key: string) {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function getStyleStr(style: CSSStyleDeclaration): string {
  return Object.keys(style)
      .map((key) => `${toLowercaseSeparator(key)}: ${style[key as keyof CSSStyleDeclaration]};`)
      .join(' ');
}

/** Returns the ratio of the device's physical pixel resolution to the css pixel resolution */
export function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

/** Whether to re-render the watermark */
export const reRendering = (mutation: MutationRecord, isWatermarkEle: (ele: Node) => boolean) => {
  let flag = false;
  // Whether to delete the watermark node
  if (mutation.removedNodes.length) {
    flag = Array.from<Node>(mutation.removedNodes).some((node) => isWatermarkEle(node));
  }
  // Whether the watermark dom property value has been modified
  if (mutation.type === 'attributes' && isWatermarkEle(mutation.target)) {
    flag = true;
  }
  return flag;
};
/**
 * Get the width and height of the watermark. The default values are as follows
 * Image: [120, 64]; Content: It's calculated by content;
 */
export function getMarkSize  (ctx: CanvasRenderingContext2D,configs:WatermarkConfigs)  {
  let defaultWidth = 120;
  let defaultHeight = 64;
  const {image,font,width,height,content} = configs

  const {
    fontSize = '16',
    fontWeight = 'normal',
    fontStyle = 'normal',
    fontFamily = 'sans-serif',
    textAlign = 'center',
  } = font;
  if (!image && ctx.measureText) {
    ctx.font = `${Number(fontSize)}px ${fontFamily}`;
    const contents = Array.isArray(content) ?content : [content];
    const sizes = contents.map((item) => {
      const metrics = ctx.measureText(item!);

      return [metrics.width, metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent];
    });
    defaultWidth = Math.ceil(Math.max(...sizes.map((size) => size[0])));
    defaultHeight =
        Math.ceil(Math.max(...sizes.map((size) => size[1]))) * contents.length +
        (contents.length - 1) * FontGap;
  }
  return [width ?? defaultWidth, height ?? defaultHeight] as const;
};
export function getMarkStyle(configs:WatermarkConfigs){
  const mergedMarkStyle:any = {
    zIndex:99999,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    backgroundRepeat: 'repeat',
  };
  const {
    offset,
    gap = [100, 100],
  } = configs;

  const [gapX , gapY ] = gap;
  const gapXCenter = gapX / 2;
  const gapYCenter = gapY / 2;
  const offsetLeft = offset?.[0] ?? gapXCenter;
  const offsetTop = offset?.[1] ?? gapYCenter;
  /** Calculate the style of the offset */
  let positionLeft = offsetLeft - gapXCenter;
  let positionTop = offsetTop - gapYCenter;
  if (positionLeft > 0) {
    mergedMarkStyle.left = `${positionLeft}px`;
    mergedMarkStyle.width = `calc(100% - ${positionLeft}px)`;
    positionLeft = 0;
  }
  if (positionTop > 0) {
    mergedMarkStyle.top = `${positionTop}px`;
    mergedMarkStyle.height = `calc(100% - ${positionTop}px)`;
    positionTop = 0;
  }
  mergedMarkStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`;

  return mergedMarkStyle;
}
export const FontGap = 3;
