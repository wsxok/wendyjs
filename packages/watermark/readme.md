# @wendyjs/watermarker  
## Install  
```
npm install @wendyjs/watermark
```
## Usage  
```javascript
import {Watermark} from '@wendyjs/watermark'
Watermark.create({content:['wendyjs','hello world']})
```
### Properties

- `zIndex?: number` - The z-index of the watermark.
- `rotate?: number` - The rotation angle of the watermark in degrees.
- `width?: number` - The width of the watermark.
- `height?: number` - The height of the watermark.
- `image?: string` - The image for the watermark.
- `content?: string | string[]` - The content of the watermark. It can be a string or an array of strings.
- `font?: object` - The font style for the watermark. It's an object with the following properties:
    - `color?: CanvasFillStrokeStyles['fillStyle']` - The color of the font.
    - `fontSize?: number | string` - The size of the font.
    - `fontWeight?: 'normal' | 'light' | 'weight' | number` - The weight of the font.
    - `fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'` - The style of the font.
    - `fontFamily?: string` - The family of the font.
    - `textAlign?: CanvasTextAlign` - The alignment of the text.
- `gap?: [number, number]` - The gap between watermarks in pixels.
- `offset?: [number, number]` - The offset of the watermark in pixels.
- `inherit?: boolean` - A flag indicating whether the watermark should inherit the styles from the parent element.
