# FFMPEG Trim And Compress

## Deployment
https://ffmpeg-trim-and-compress.vercel.app/

## Why did I make this? 

I have been using ffmpeg as a command line tool for years to trim and convert my gaming clips from large files, which are roughly 2GB for 5 minute clips, to h.264 encoded clips. Resulting in much smaller file sizes that can be easily shared online.  However the person I play most frequently with doesn't do this and his current method of sharing his best gaming moments is to use his phone to record his screen as the clip plays in a media player. 

![Call of Duty recorded with phone](./filming_screen_clip.gif)

With this web app he is able to easily trim and convert his clips to a filesize that can be sent over facebook, google drive, etc and my life is more pleasant because of it.

## Technology

[ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)

[React.js](https://reactjs.org/)

[TailwindCSS](https://tailwindcss.com/)


## Usage
- Drag and drop or select an mp4 file
- Change the trim inputs to the start and end points for the clip
- Select the desired quality
- Hit convert and wait for the conversion
- Look at the results and save the video 

## Advantages

It's free and it's easy to use. 

Your data never leaves your computer. 

The WebAssembly package creates a temporary filesystem in your computer's memory. When you click save you are getting the file from this temporary filesystem and saving it to your hard drive. 


## Limitations
It does not work on mobile. There is an issue with using SharedArrayBuffer on mobile browsers and older versions of desktop browsers. 

There is a 2GB file size limit as WebAssembly cannot currently handle anything bigger. 

Conversion can take a looooong time. 

---

## TODO
- [ ] Make it a PWA

- [ ] Progress bar for conversion
- [ ] Trim only option
- [ ] Solve mobile compatibility issue



