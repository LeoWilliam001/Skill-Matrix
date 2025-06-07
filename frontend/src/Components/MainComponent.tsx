// import React from "react"

export default function MainComponent(){
    return(
    <><div className='border-4 border-blue-200 ml-2'>
        <div className='border-4 border-red-300'>Header</div>
        <div className='flex'>
          <div className='flex flex-grow border-4 border-yellow-400'>Main Content</div>
          <div className='flex flex-col'>
            <div className='w-64 border-4 border-slate-400'>Side Bar</div>
            <div className='border-4 border-green-400'>About</div>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className='w-1/2 border-4 border-amber-500'>01</div>
        <div className='w-1/2 border-4 border-fuchsia-600'>02</div>
        <div className='w-1/2 border-4 border-emerald-500'>03</div>
      </div>
        <div className="border border-amber-600 grid grid-cols-3 gap-4 p-4">
        <div className="border border-purple-500 text-center p-2">01</div>
        <div className="border border-purple-500 text-center p-2">02</div>
        <div className="border border-purple-500 text-center p-2">03</div>
        <div className="border border-purple-500 text-center p-2">04</div>
        <div className="border border-purple-500 text-center p-2">05</div>
        <div className="border border-purple-500 text-center p-2">06</div>
        <div className="border border-purple-500 text-center p-2">07</div>
        <div className="border border-purple-500 text-center p-2">08</div>
        <div className="border border-purple-500 text-center p-2">09</div>
      </div>

      <div className="flex items-baseline space-x-4">
        <div className="text-4xl">Big</div>
        <div className="text-sm">Small</div>
      </div>
      </>);
}