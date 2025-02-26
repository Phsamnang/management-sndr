'use client'

import { employeeService } from '@/service/empolyee-service'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function page() {

  const {data}=useQuery({
    queryFn:()=>employeeService.getEmployee(),
    queryKey:['employee']
  }) 

  console.log(data,"data")


  return (
    <div>Employee</div>
  )
}
