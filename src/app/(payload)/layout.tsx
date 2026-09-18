/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config';
import '@payloadcms/next/css';
import type { ServerFunctionClient } from 'payload';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import React from 'react';

import { importMap } from './admin/importMap.js';
// Payload 3 loads admin styles via this import (admin.css in config is currently disabled).
// Keep styles in ./custom.css — that file is the upgrade-safe source of truth.
import './custom.css';

/** Payload admin cold-starts need headroom on Vercel (DB + RSC). */
export const maxDuration = 60;

/** Prefer US East to stay near Neon Ohio (us-east-2). */
export const preferredRegion = ['iad1'];

/** Admin layout bootstraps Payload against Postgres at request time. */
export const dynamic = 'force-dynamic';

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  try {
    return await handleServerFunctions({
      ...args,
      config,
      importMap,
    });
  } catch (error) {
    console.error('[payload] serverFunction failed:', error);
    throw error;
  }
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
