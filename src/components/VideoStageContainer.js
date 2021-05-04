import Header from './Header'
import Footer from './Footer'

const VideoStageContainer = (props) => {

  return (
    <div className="min-h-screen  flex flex-col justify-center sm:px-6 lg:px-8">
      <Header />
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="py-8 px-4 sm:px-10">
          <div className="space-y-6 ">
            {props.children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default VideoStageContainer