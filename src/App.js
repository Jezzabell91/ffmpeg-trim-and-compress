import Converter from './components/converter'
import AppState from './context/AppState'

const App = () => {

  return(
    <AppState>
      <Converter />
    </AppState>
  )
  
}

export default App
