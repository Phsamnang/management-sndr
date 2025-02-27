'use client'

import { Button } from '@/components/ui/button'
import { employeeService } from '@/service/empolyee-service'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import EmployeeTablee from './EmployeeTable'


export default function page() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "nm",
      header: "Name",
    },
    {
      accessorKey: "usr_nm",
      header: "Username",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "actions",
      cell: ({ row:any }) => {
        return (
          <a
            href="#"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Edit
          </a>
        );
      },
    },
  ];

  const {data,isLoading}=useQuery({
    queryFn:()=>employeeService.getEmployee(),
    queryKey:['employee']
  }) 
  if(isLoading) return <>....</>
  return (
    <div className='px-9'>
      <EmployeeTablee data={data} columns={columns} />
    </div>
  )
}
