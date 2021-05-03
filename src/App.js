import Converter from './components/Converter'
import AppState from './context/AppState'

const App = () => {

  return(
    <AppState>
      <Converter />
    </AppState>
  )
  
}

export default App
