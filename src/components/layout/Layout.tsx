import * as React from 'react';

const url = '/images/header2.jpg';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <>
      <div className='w-full'>
        <div className='pt-16pb-3 min-h-screen-75 relative flex content-center items-center justify-center '>
          <div
            className='absolute top-0 h-full w-full bg-cover bg-center'
            style={{
              backgroundImage: `url(${url})`,
            }}
          >
            <span className='absolute h-full w-full bg-black opacity-75'></span>
          </div>
          <div className='container relative mx-auto'>
            <div className='flex flex-wrap items-center'>
              <div className='ml-auto mr-auto w-full px-4 py-8  text-center lg:w-7/12'>
                <div className=''>
                  <h1 className='text-5xl font-semibold text-white'>
                    Truth Shield
                  </h1>
                  <p className='text-blueGray-300 mt-4 text-lg text-white'>
                    Account Portal
                  </p>
                </div>
                <div className='mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center'>
                  <div className='space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0'>
                    <a
                      href='#'
                      className='flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8'
                    >
                      Log In
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='absolute top-auto bottom-0 w-full'>
            <div className='h-70-px transl pointer-events-none w-full overflow-hidden'>
              <svg
                className='absolute bottom-0 overflow-hidden'
                xmlns='http://www.w3.org/2000/svg'
                preserveAspectRatio='none'
                version='1.1'
                viewBox='0 0 2560 100'
                x='0'
                y='0'
              >
                <polygon
                  className='text-blueGray-100 fill-current'
                  points='2560 0 2560 100 0 100'
                ></polygon>
              </svg>
            </div>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
