import {getMarkSize, getMarkStyle, getPixelRatio, getStyleStr, reRendering} from "./utils";
import useClips from "./useClips";
import {WatermarkConfigs, WatermarkInfo,FontStyle} from "./type";
import { debounce } from 'es-toolkit'
export class Watermark{
    watermarkMap:Map<HTMLElement, HTMLDivElement>
    configs:WatermarkConfigs
    getClips = useClips();
    watermarkInfo:WatermarkInfo = ['',0]
    observer:MutationObserver
    container?:HTMLElement
    private static instance:Watermark
    private debounced:Function
    private constructor(configs:WatermarkConfigs,container?:HTMLElement) {
        this.configs = {
            /**
             * The antd content layer zIndex is basically below 10
             * https://github.com/ant-design/ant-design/blob/6192403b2ce517c017f9e58a32d58774921c10cd/components/style/themes/default.less#L335
             */
            zIndex : 99999,
            rotate : -22,
            font : {},
            gap : [100, 100],
            inherit :true,
            ...configs
        }
        this.container = container|| document.body
        this.watermarkMap = new Map()
        this.debounced  = debounce( this.renderWatermark.bind(this),500)
        this.observer = new MutationObserver(this.onMutate.bind(this));
    }

    static create(configs:WatermarkConfigs,container?:HTMLElement):Watermark{
        if (this.instance == null) {
            this.instance = new Watermark(configs,container);
        }else {
            if(configs){
                this.instance.configs = {
                    ...this.instance.configs,
                    ...configs
                }
            }
            if(container){
                this.instance.container = container
            }
        }

        this.instance.renderWatermark()
        return this.instance;
    }
    private onMutate(mutationsList:MutationRecord[]){
        // const fixedStyle = {
        //     position: 'relative',
        //     overflow: 'hidden',
        // };
        // const mergedStyle = {
        //     ...fixedStyle,
        //     ...this.configs.style,
        // };
        const isWatermarkEle = (ele: any) => Array.from(this.watermarkMap.values()).includes(ele);
        for (let mutation of mutationsList) {

            if (reRendering(mutation, isWatermarkEle)) {
                // console.log('reRendering...')
                this.debounced(this.container,true);
            } else if (mutation.target === this.container && mutation.attributeName === 'style') {
                //TODO


                // const keyStyles = Object.keys(fixedStyle);
                //
                // for (let i = 0; i < keyStyles.length; i += 1) {
                //     const key = keyStyles[i];
                //     const oriValue = (mergedStyle as any)[key];
                //     const currentValue = (this.container.style as any)[key];
                //
                //     if (oriValue && oriValue !== currentValue) {
                //         (this.container.style as any)[key] = oriValue;
                //     }
                // }
            }
        }
    }
    renderWatermark(container?:HTMLElement){
        if(container){
            this.container = container
        }
        this.removeWatermark(this.container!)
        const {
            /**
             * The antd content layer zIndex is basically below 10
             * https://github.com/ant-design/ant-design/blob/6192403b2ce517c017f9e58a32d58774921c10cd/components/style/themes/default.less#L335
             */
            rotate = -22,
            image,
            content,
            font = {},
            gap = [100, 100],
            // offset,
        } = this.configs;
        const {
            color = FontStyle.Color,
            fontSize = FontStyle.FontSize,
            fontWeight = FontStyle.FontWeight,
            fontStyle = FontStyle.FontStyle,
            fontFamily = FontStyle.FontFamily,
            textAlign = FontStyle.TextAlign,
        } = font;
        const [gapX , gapY ] = gap;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx && this.container) {
            const ratio = getPixelRatio();
            const [markWidth, markHeight] = getMarkSize(ctx,this.configs);
            const drawCanvas = (
                drawContent?: NonNullable<WatermarkConfigs['content']> | HTMLImageElement,
            ) => {
                const [nextClips, clipWidth] = this.getClips(
                    drawContent || '',
                    rotate,
                    ratio,
                    markWidth,
                    markHeight,
                    {
                        color,
                        fontSize,
                        fontStyle,
                        fontWeight,
                        fontFamily,
                        textAlign,
                    },
                    gapX,
                    gapY,
                );
                this.watermarkInfo = [nextClips, clipWidth]
                // @ts-ignore
                const watermarkEle = this.appendWatermark(this.watermarkInfo[0],this.watermarkInfo[1],this.container)
                // @ts-ignore
                this.observer.observe(this.container, { attributes: true, childList: true, subtree: true });
                if(watermarkEle){
                    this.observer.observe(watermarkEle, { attributes: true, childList: true, subtree: true });
                }

            };

            if (image) {
                const img = new Image();
                img.onload = () => {
                    drawCanvas(img);
                };
                img.onerror = () => {
                    drawCanvas(content);
                };
                img.crossOrigin = 'anonymous';
                img.referrerPolicy = 'no-referrer';
                img.src = image;
            } else {
                drawCanvas(content);
            }

        }
    }
    appendWatermark(base64Url: string, markWidth: number, container: HTMLElement){
        let watermarkEle
        if (container) {
            if (!this.watermarkMap.get(container)) {
                const newWatermarkEle = document.createElement('div');
                this.watermarkMap.set(container, newWatermarkEle);
            }

            watermarkEle = this.watermarkMap.get(container)!;
            const markStyle = getMarkStyle(this.configs)
            const emphasizedStyle = {
                visibility: 'visible !important',
            };
            watermarkEle.setAttribute(
                'style',
                getStyleStr({
                    ...markStyle,
                    backgroundImage: `url('${base64Url}')`,
                    backgroundSize: `${Math.floor(markWidth)}px`,
                    ...emphasizedStyle,
                }),
            );
            // Prevents using the browser `Hide Element` to hide watermarks
            watermarkEle.removeAttribute('class');

            if (watermarkEle.parentElement !== container) {
                container.append(watermarkEle);
            }
        }

        return watermarkEle;
    }
    removeWatermark (container: HTMLElement)  {
        const watermarkEle = this.watermarkMap.get(container);

        if (watermarkEle &&  watermarkEle.parentNode) {
            watermarkEle.parentNode.removeChild(watermarkEle);
        }
        this.watermarkMap.delete(container);
        this.observer.disconnect();
    };
}
