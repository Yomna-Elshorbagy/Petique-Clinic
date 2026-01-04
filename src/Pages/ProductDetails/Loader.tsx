import { FallingLines } from 'react-loader-spinner';
export default function Loader() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
   <FallingLines
    color="#e9a66f"
    width="100"
    visible={true}
    ariaLabel="falling-circles-loading"
  />
  </div>
  )
}
