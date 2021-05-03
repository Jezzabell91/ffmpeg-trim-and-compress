import { useContext } from 'react'
import { RadioGroup } from '@headlessui/react'
import AppContext from '../context/app-context'



const qualityOptions = [
  { name: '480p', value: 480, conversionTime: 'Medium Conversion Time', conversionSize: '5 Mins = ~50mb' },
  { name: '720p', value: 720, conversionTime: 'Slow Conversion Time', conversionSize: '5 Mins = ~120mb' },
  { name: '1080p', value: 1080, conversionTime: 'Very Slow Conversion Time', conversionSize: '5 Mins = ~200mb' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



const QualitySelection = () => {

    const { quality, setQuality} = useContext(AppContext)

  return (
    <RadioGroup value={quality} onChange={setQuality}>
      <RadioGroup.Label className="sr-only">Select Quality</RadioGroup.Label>
      <div className="relative bg-white rounded-md -space-y-px">
        {qualityOptions.map((option, optionIdx) => (
          <RadioGroup.Option
            key={option.name}
            value={option.value}
            className={({ checked }) =>
              classNames(
                optionIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                optionIdx === qualityOptions.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                checked ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200',
                'relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3 focus:outline-none'
              )
            }
          >
            {({ active, checked }) => (
              <>
                <div className="flex items-center text-sm">
                  <span
                    className={classNames(
                      checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
                      active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                      'h-4 w-4 rounded-full border flex items-center justify-center'
                    )}
                    aria-hidden="true"
                  >
                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                  </span>
                  <RadioGroup.Label as="span" className="ml-3 font-medium text-gray-900">
                    {option.value}
                  </RadioGroup.Label>
                </div>
                <RadioGroup.Description className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
                  <span className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'font-medium')}>
                    {option.conversionTime}
                  </span>
                </RadioGroup.Description>
                <RadioGroup.Description
                  className={classNames(
                    checked ? 'text-indigo-700' : 'text-gray-500',
                    'ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right'
                  )}
                >
                  {option.conversionSize}
                </RadioGroup.Description>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}

export default QualitySelection