const NotCompatible = () => {

    return (
          <div className="w-screen h-screen bg-gray-900 flex flex-wrap place-items-center" >
              <p className="text-2xl md:text-4xl lg:text-6xl xl:text-8xl font-bold text-left text-green-500 px-4">Unfortunately the technology used is not yet supported by this browser.</p>
              <p className="text-2xl md:text-4xl lg:text-6xl xl:text-8xl font-bold text-right text-green-500 px-4">Please try using the latest desktop versions of Chrome or Firefox</p>
          </div>
    )

}

export default NotCompatible