import React from 'react'
import ProductsDataList from '../../_components/ProductsDataList'

export default async function CategoryItemPage({ params }) {
  const { categoryId } = await params;
  return (
    <ProductsDataList />
  )
}
