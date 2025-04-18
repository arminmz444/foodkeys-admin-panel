// src/app/modules/newsletter/NewsletterConfig.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { lazy } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const NewsletterLayout = lazy(() => import('./NewsletterLayout'));
const NewsletterDashboard = lazy(() => import('./NewsletterDashboard'));
const NewsletterList = lazy(() => import('./NewsletterList'));
const NewsletterForm = lazy(() => import('./NewsletterForm'));
const NewsletterDetail = lazy(() => import('./NewsletterDetail'));
const PendingNewsletters = lazy(() => import('./PendingNewsletters'));
const Subscribers = lazy(() => import('./Subscribers'));

const NewsletterConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: true
        },
        toolbar: {
          display: true
        },
        footer: {
          display: true
        },
        leftSidePanel: {
          display: true
        }
      }
    }
  },
  routes: [
    {
      path: 'newsletters',
      element: <NewsletterLayout />,
      children: [
        {
          path: '',
          element: <NewsletterList />
        },
        {
          path: 'dashboard',
          element: <NewsletterDashboard />
        },
        {
          path: 'new',
          element: <NewsletterForm />
        },
        {
          path: 'edit/:id',
          element: <NewsletterForm />
        },
        {
          path: 'detail/:id',
          element: <NewsletterDetail />
        },
        {
          path: 'pending',
          element: <PendingNewsletters />
        },
        {
          path: 'subscribers',
          element: <Subscribers />
        }
      ]
    }
  ]
};

export default NewsletterConfig;