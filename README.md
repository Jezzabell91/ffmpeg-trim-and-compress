# Gaming Clip: Trim and Compress in your Browser

## Why am I making this? 

I have been using ffmpeg as a command line tool for years to trim and convert my gaming clips from large files, which are roughly 2GB for 5 minute clips, to h.264 encoded clips. Resulting in much smaller file sizes that can be easily shared online.  However the person I play most frequently with is pretty average at working with computers and his current method of sharing his best gaming moments is to use his phone to record his screen as the clip plays in a media player. 

![Call of Duty recorded with phone](./filming_screen_clip.gif)

With this web app I am hoping that he will be able to easily trim and convert his clips so that my life is more pleasant.

## Technology

[ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)

[React.js](https://reactjs.org/)

[TailwindCSS](https://tailwindcss.com/)


## Getting Started

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Limitations
There is a 2GB file size limit as WebAssembly cannot currently handle anything bigger. 

ffmpeg.wasm works with Chrome and the latest versions of Firefox.

Conversion can take a looooong time. 

## TODO
- [x] Switch converter from .gif to h264 encoded .mp4
- [x] Only allow video files to be chosen
- [x] Select start and end breakpoints to trim
- [ ] Add styling with Tailwindcss 
- [ ] Make it a PWA
- [ ] Deploy to Vercel
- [ ] React-form-hook
- [x] Options for resize, quality
- [x] Improve ffmpeg speed (input seeking trim first before doing transcoding)


