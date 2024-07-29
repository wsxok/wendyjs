export type WatermarkConfigs = {
    zIndex?: number;
    rotate?: number;
    width?: number;
    height?: number;
    image?: string;
    content?: string | string[];
    font?: {
        color?: CanvasFillStrokeStyles['fillStyle'];
        fontSize?: number | string;
        fontWeight?: 'normal' | 'light' | 'weight' | number;
        fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
        fontFamily?: string;
        textAlign?: CanvasTextAlign;
    };
    style?: CSSStyleDeclaration;
    className?: string;
    rootClassName?: string;
    gap?: [number, number];
    offset?: [number, number];
    children?: HTMLElement;
    inherit?: boolean;
}
export type WatermarkInfo = [base64: string, contentWidth: number]
export enum FontStyle {
    Color='rgba(0,0,0,0.1)',
    FontSize=14,
    FontWeight = 'normal',
    FontStyle = 'normal',
    FontFamily = 'sans-serif',
    TextAlign = 'center'
}
