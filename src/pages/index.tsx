/* eslint-disable @next/next/no-img-element */
/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import {
  CogIcon,
  CreditCardIcon,
  GiftIcon,
  TagIcon,
  ThumbDownIcon,
  ThumbUpIcon,
  UserGroupIcon,
} from '@heroicons/react/solid';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

const tabs = [
  { name: 'Requests', href: '#', icon: TagIcon, current: false },
  { name: 'Users', href: '#', icon: UserGroupIcon, current: false },
  { name: 'Products', href: '#', icon: GiftIcon, current: false },
  { name: 'Subscriptions', href: '#', icon: CogIcon, current: true },
  { name: 'Payments', href: '#', icon: CreditCardIcon, current: false },
];

const filters = [
  { name: 'Pending', href: '#', count: '12', current: true },
  { name: 'Approved', href: '#', count: '8', current: false },
  { name: 'Denied', href: '#', count: '2', current: false },
  { name: 'All', href: '#', count: '20', current: false },
];

const requests = [
  {
    name: 'Jane Cooper',
    title: 'Paradigm Representative',
    cost: '+$3.95/mo',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    time: 'December 9 at 11:43 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  // More people...
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  // const { user, login, logout } = useWunderGraph();
  // const { result: userInfo } = useQuery.;
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <div>
        {/**** NAV */}
        <div className='no-scrollbar overflow-x-scroll'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-5' aria-label='Tabs'>
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    tab.current
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
                  )}
                  aria-current={tab.current ? 'page' : undefined}
                >
                  <div className='flex-none py-6 px-3 first:pl-6 last:pr-6'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                      <tab.icon
                        className={classNames(
                          tab.current
                            ? 'text-indigo-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          '-ml-0.5 mr-2 h-8 w-8'
                        )}
                        aria-hidden='true'
                      />
                      <strong>{tab.name}</strong>
                    </div>
                  </div>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div>
        {/* Hero card */}
        <div className='relative'>
          <div className='absolute inset-x-0 bottom-0 h-1/2 bg-gray-100' />
          <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
            <div className='relative shadow-xl sm:overflow-hidden sm:rounded-2xl'>
              <div className='absolute inset-0'>
                <img
                  className='h-full w-full object-cover'
                  src='https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100'
                  alt='People working on laptops'
                />
                <div className='absolute inset-0 bg-indigo-700 mix-blend-multiply' />
              </div>
              <div className='relative px-4 py-8 sm:px-6 sm:py-24 lg:py-32 lg:px-8'>
                <h1 className='text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl'>
                  <span className='block text-white'>MANAGE</span>
                  <span className='block text-indigo-200'>REQUESTS</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='overflow-hidden bg-gray-200 font-sans antialiased'>
        <div className='bg-gray-100 py-8'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-5 bg-gray-50'>
              {/* Filters */}
              <div className='sm:hidden'>
                <label htmlFor='tabs' className='sr-only'>
                  Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                  id='tabs'
                  name='tabs'
                  className='block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  defaultValue={filters.find((filter) => filter.current)?.name}
                >
                  {filters.map((filter) => (
                    <option key={filter.name}>{filter.name}</option>
                  ))}
                </select>
              </div>
              <div className='hidden sm:block'>
                <div className='border-b border-gray-200'>
                  <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
                    {filters.map((filter) => (
                      <a
                        key={filter.name}
                        href='#'
                        className={classNames(
                          filter.current
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                          'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                        )}
                        aria-current={filter.current ? 'page' : undefined}
                      >
                        {filter.name}
                        {filter.count ? (
                          <span
                            className={classNames(
                              filter.current
                                ? 'bg-indigo-100 text-indigo-600'
                                : 'bg-gray-100 text-gray-900',
                              'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block'
                            )}
                          >
                            {filter.count}
                          </span>
                        ) : null}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            {/* Requests  */}
            <ul
              role='list'
              className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            >
              {requests.map((request) => (
                <li
                  key={request.email}
                  className='col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow'
                >
                  <div className='border-b border-gray-200 bg-white px-4 py-5 sm:px-6'>
                    <h3 className='text-lg font-medium leading-6 text-gray-900'>
                      Request Type
                    </h3>
                    <p className='mt-1 text-sm text-gray-500'>
                      Brief Description
                    </p>
                    <dd className='mt-3'>
                      <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                        {request.cost}
                      </span>
                    </dd>
                  </div>

                  <div className='bg-white px-4 py-5 sm:px-6'>
                    <div className='flex space-x-3'>
                      <div className='flex-shrink-0'>
                        <img
                          className='mx-auto h-12 w-12 flex-shrink-0 rounded-full'
                          src={request.imageUrl}
                          alt=''
                        />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-gray-900'>
                          <a href='#' className='hover:underline'>
                            {request.name}
                          </a>
                        </p>
                        <p className='text-sm text-gray-500'>
                          <a href='#' className='hover:underline'>
                            {request.time}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className='m-3 text-left text-sm'>
                      Repudiandae sint consequuntur vel. Amet ut nobis explicabo
                      numquam expedita quia omnis voluptatem. Minus quidem ipsam
                      quia iusto.
                    </p>
                  </div>

                  <div>
                    <div className='-mt-px flex divide-x divide-gray-200'>
                      <div className='flex w-0 flex-1'>
                        <a
                          href={`mailto:${request.email}`}
                          className='relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500'
                        >
                          <ThumbDownIcon
                            className='h-5 w-5 text-gray-400'
                            aria-hidden='true'
                          />
                          <span className='ml-3'>Deny</span>
                        </a>
                      </div>
                      <div className='-ml-px flex w-0 flex-1'>
                        <a
                          href={`tel:${request.telephone}`}
                          className='relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500'
                        >
                          <span className='mr-3'>Approve</span>
                          <ThumbUpIcon
                            className='h-5 w-5 text-gray-400'
                            aria-hidden='true'
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
