import React, { useContext } from 'react';
import AdminLayout from './AdminLayout';
import SubmissionsGrading from '../../components/SubmissionsGrading';
import { AuthContext } from '../../context/AuthContext';

const AdminSubmissions = () => {
  const { token } = useContext(AuthContext);
  const authHeaders = { Authorization: `Bearer ${token}` };
  return (
    <AdminLayout title="Correction des livrables">
      <SubmissionsGrading authHeaders={authHeaders} />
    </AdminLayout>
  );
};
export default AdminSubmissions;