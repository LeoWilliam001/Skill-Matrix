import './App.css'
import MainComponent from './Components/MainComponent'
import Image from "./react-logo.png";
function MainContent()
{
  return <h1>Welcome Leo</h1>
}
function App() {

  return (
    <>
    <header className='border-b-2 border-gray-400'>

      
      <nav className='flex justify-between'>
      <img src={Image} className='m-2 w-14 h-12'/>
        <ul className='flex flex-row-reverse'>
          <li className='m-2 mt-4'>About</li>
          <li className='m-2 mt-4'>Contacts</li>
          <li className='m-2 mt-4 '>Pricing</li>
        </ul>
      </nav>
    </header>
      <h1 className='text-white bg-blue-500 p-2 m-1 max-w-1/8 rounded-sm'>Hello world</h1>
      <br/>
      <MainComponent/>
      <MainContent/>
    </>
  )
}

export default App
