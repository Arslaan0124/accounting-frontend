import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import InvoicePage from 'features/invoices/InvoicePage';
import NewInvoice from 'features/invoices/NewInvoice';
import InvoiceDetailPage from 'features/invoices/InvoiceDetailPage';
import ItemsPage from 'features/items/ItemsPage';
import ItemDetailPage from 'features/items/ItemDetailPage';
import NewItem from 'features/items/NewItem';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from 'pages/error/Notfound';
import CustomersPage from 'features/customers/CustomersPage';
import CustomerDetailPage from 'features/customers/CustomerDetailPage';
import NewCustomer from 'features/customers/NewCustomer';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

const MainRoutes = {
    path: '/',
    element: (
        <>
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} closeOnClick={true} pauseOnHover={true} />
            <MainLayout />,
        </>
    ),
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'color',
            element: <Color />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'invoices',
            element: <InvoicePage />
        },
        {
            path: 'invoices/:id',
            element: <InvoiceDetailPage />
        },
        {
            path: 'new-invoice',
            element: <NewInvoice />
        },
        {
            path: 'items',
            element: <ItemsPage />
        },
        {
            path: 'items/:id',
            element: <ItemDetailPage />
        },
        {
            path: 'new-item',
            element: <NewItem />
        },
        {
            path: 'customers',
            element: <CustomersPage />
        },
        {
            path: 'customers/:id',
            element: <CustomerDetailPage />
        },
        {
            path: 'new-customer',
            element: <NewCustomer />
        },
        {
            path: '*',
            element: <NotFound />
        }
    ]
};

export default MainRoutes;
