const VideoStageContainer = (props) => {

    return(
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 place-items-center gap-y-12">
        <div class="max-w-3xl mx-auto">
          <div className="bg-transparent overflow-hidden rounded-lg max-w-xl h-full grid grid-cols-1 place-items-around gap-y-12">
            <div className="px-4 py-5 sm:p-6 ">
            {props.children}
            </div>
          </div>
        </div>
      </div>
    )
}

export default VideoStageContainer