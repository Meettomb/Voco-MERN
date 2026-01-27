import React from 'react'
import { Outlet } from 'react-router-dom';
import AdminHeader from './Components/admin/AdminHeader';

export default function AdminSideMainLayout() {
    return (
        <>
            <AdminHeader />
        </>
    );
}
