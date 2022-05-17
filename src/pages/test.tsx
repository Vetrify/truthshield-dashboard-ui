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

import * as React from 'react';

import Button from '@/components/buttons/Button';
import { useQuery } from '@/components/generated/wundergraph.nextjs.integration';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(' ');
// }

export default function TestPage() {
  const data = useQuery.AdminPortal(); // hits service on page load

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <div className='m-40'>
        <Button className='align-middle'>Click me!</Button>
        <div>{data.result.status}</div>
      </div>
    </Layout>
  );
}
