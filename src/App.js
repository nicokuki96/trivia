import './App.css';
import Question from './components/Question';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <Question/>
      </ChakraProvider>
    </div>
  );
}

export default App;
